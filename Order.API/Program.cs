using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Order.API;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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


builder.Services.AddSingleton<RulesEngineService>();



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
