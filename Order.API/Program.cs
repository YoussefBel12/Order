using System.Reflection;
using System.Text;
using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Order.API;
using Order.API.Entities;
using Order.API.Identity;





var builder = WebApplication.CreateBuilder(args);



// Add services to the container.


// Add Identity services
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<OrderDbContext>()
    .AddDefaultTokenProviders();

// Add JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
    };
});

builder.Services.AddAuthorization();










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



// cors for elsa u can delete if it dosent work //i think it works?
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowElsa", policy =>
    {
        policy
            .WithOrigins("https://localhost:52344") // ✅ Elsa Server origin
            .AllowAnyHeader()
            .AllowAnyMethod();
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



//added this primarly for Purchase feature
// Register MediatR for Purchase feature (single registration is enough)
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(
    typeof(GetAllPurchasesQueryHandler).Assembly
));



// Register DbContext
builder.Services.AddDbContext<OrderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Register Repository
builder.Services.AddScoped<IOrderRepository, OrderRepository>();


builder.Services.AddScoped<RulesEngineService>();

builder.Services.AddScoped<IStockService, StockService>();


builder.Services.AddScoped<INotificationService, NotificationService>();


builder.Services.AddScoped<IPurchaseService, PurchaseService>();







// Add configuration binding
builder.Services.Configure<ConfigurationBuilder>(
    builder.Configuration.GetSection("RuleArchiving")
);

// Add the background service
builder.Services.AddHostedService<RuleArchivingService>();


builder.Services.AddHostedService<RulesActivationService>();



builder.Services.AddControllers();







/*
 this is old swagger dont delete it yet

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





    // Configure Swagger/OpenAPI to include JWT authentication
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        // Enable Swagger to recognize the Bearer token
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter your Bearer token"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
    });


    c.DocInclusionPredicate((version, apiDescription) =>
    {
        return apiDescription.GroupName == version;
    });

    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});
*/
// Configure Swagger/OpenAPI to include JWT authentication
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Enable Swagger to recognize the Bearer token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your Bearer token"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});








var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(/*c =>
    {
        var provider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

        foreach (var description in provider.ApiVersionDescriptions)
        {
            c.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
        }
    }*/); // this commented line is for old swagger its cmnted up
}

app.UseHttpsRedirection();


app.UseCors("AllowReactApp");


//added 2 lines below //i forgot probably one line

app.UseCors("AllowElsa");


//added 2 lines below for Identity and JWT
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
