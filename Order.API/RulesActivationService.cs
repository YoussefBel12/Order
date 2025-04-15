using Microsoft.EntityFrameworkCore;
using Order.API;
using Order.API.Entities;

public class RulesActivationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<RulesActivationService> _logger;

    public RulesActivationService(IServiceProvider serviceProvider, ILogger<RulesActivationService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<OrderDbContext>();

                    var now = DateTime.UtcNow;

                    // Activate rules where ActivationDate <= now and IsActive is false
                    var rulesToActivate = await dbContext.RulesEngineConfigs
                        .Where(r => r.ActivationDate <= now && r.IsActive == false && (r.DesactivationDate == null || r.DesactivationDate > now))
                        .ToListAsync(stoppingToken);

                    foreach (var rule in rulesToActivate)
                    {
                        rule.IsActive = true;
                        dbContext.Entry(rule).State = EntityState.Modified;
                    }

                    // Deactivate rules where DeactivationDate <= now and IsActive is true
                    var rulesToDeactivate = await dbContext.RulesEngineConfigs
                        .Where(r => r.DesactivationDate <= now && r.IsActive == true)
                        .ToListAsync(stoppingToken);

                    foreach (var rule in rulesToDeactivate)
                    {
                        rule.IsActive = false;
                        dbContext.Entry(rule).State = EntityState.Modified;
                    }

                    await dbContext.SaveChangesAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing rule activation/deactivation.");
            }

            // Wait for a minute before checking again
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
