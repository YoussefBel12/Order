using System.Reflection;
using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Order.API;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:63742") // Frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
        //next line below i added from a video looks important
              .AllowCredentials();
    });
});







// Add API versioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version")
    );
})

.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});












//register MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(
    Assembly.GetAssembly(typeof(GetOrdersQueryHandler)),
    Assembly.GetAssembly(typeof(AddOrderCommandHandler)),
    Assembly.GetAssembly(typeof(GetOrdersQueryHandler)),
    Assembly.GetAssembly(typeof(UpdateOrderCommandHandler)),
    Assembly.GetAssembly(typeof(DeleteOrderCommandHandler))
));




// Register DbContext
builder.Services.AddDbContext<OrderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Register Repository
builder.Services.AddScoped<IOrderRepository, OrderRepository>();


builder.Services.AddScoped<RulesEngineService>();

builder.Services.AddScoped<IStockService, StockService>();


// Add configuration binding
builder.Services.Configure<ConfigurationBuilder>(
    builder.Configuration.GetSection("RuleArchiving")
);

// Add the background service
builder.Services.AddHostedService<RuleArchivingService>();


builder.Services.AddHostedService<RulesActivationService>();



builder.Services.AddControllers();








builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(c =>
{
    var provider = builder.Services.BuildServiceProvider().GetRequiredService<IApiVersionDescriptionProvider>();

    foreach (var description in provider.ApiVersionDescriptions)
    {
        c.SwaggerDoc(description.GroupName, new OpenApiInfo
        {
            Title = $"My API {description.ApiVersion}",
            Version = description.ApiVersion.ToString()
        });
    }

    c.DocInclusionPredicate((version, apiDescription) =>
    {
        return apiDescription.GroupName == version;
    });

    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

        foreach (var description in provider.ApiVersionDescriptions)
        {
            c.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
        }
    });
}

app.UseHttpsRedirection();


app.UseCors("AllowReactApp"); 

app.UseAuthorization();

app.MapControllers();

app.Run();
