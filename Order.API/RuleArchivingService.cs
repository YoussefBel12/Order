/*
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Order.API
{
    public class RuleArchivingService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly ILogger<RuleArchivingService> _logger;

        public RuleArchivingService(
            IServiceProvider services,
            ILogger<RuleArchivingService> logger)
        {
            _services = services;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Rule Archiving Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _services.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<OrderDbContext>();

                    // Get rules that have expired but aren't archived yet
                    var expiredRules = await dbContext.RulesEngineConfigs
                        .Where(r => !r.IsArchived &&
                              r.ExpirationDate != null &&
                              r.ExpirationDate <= DateTime.UtcNow)
                        .ToListAsync();

                    if (expiredRules.Any())
                    {
                        _logger.LogInformation($"Archiving {expiredRules.Count} expired rules");

                        foreach (var rule in expiredRules)
                        {
                            rule.IsArchived = true;
                            _logger.LogDebug($"Archived rule ID: {rule.Id}, Version: {rule.Version}");
                        }

                        await dbContext.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while archiving rules");
                }

                // Wait 1 hour before next check
                await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken);
            }
        }
    }


}
*/


using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Order.API
{
    public class RuleArchivingService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly ILogger<RuleArchivingService> _logger;
        private readonly IConfiguration _config;

        public RuleArchivingService(
            IServiceProvider services,
            ILogger<RuleArchivingService> logger,
            IConfiguration config)
        {
            _services = services;
            _logger = logger;
            _config = config;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _services.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<OrderDbContext>();

                    var checkInterval = _config.GetValue<int>("RuleArchiving:CheckIntervalMinutes", 60);
                    var expiredRules = await dbContext.RulesEngineConfigs
                        .Where(r => !r.IsArchived &&
                               r.ExpirationDate != null &&
                               r.ExpirationDate <= DateTime.UtcNow)
                        .ToListAsync();

                    if (expiredRules.Any())
                    {
                        expiredRules.ForEach(r => r.IsArchived = true);
                        await dbContext.SaveChangesAsync();
                    }

                    await Task.Delay(TimeSpan.FromMinutes(checkInterval), stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in rule archiving");
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // Wait 5 min on error
                }
            }
        }
    }
}