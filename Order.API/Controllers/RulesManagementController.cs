using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.API.Entities; // Adjust the namespace as needed

namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RulesManagementController : ControllerBase
    {
        private readonly OrderDbContext _dbContext;
        private readonly ILogger<RulesManagementController> _logger;

        public RulesManagementController(OrderDbContext dbContext, ILogger<RulesManagementController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        // GET: api/RulesManagement
        // Retrieves all rules configurations.
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RulesEngineConfigs>>> GetAllRules()
        {
            var rules = await _dbContext.RulesEngineConfigs.ToListAsync();
            return Ok(rules);
        }

        // GET: api/RulesManagement/{id}
        // Retrieves a single rule configuration by its ID.
        [HttpGet("{id}")]
        public async Task<ActionResult<RulesEngineConfigs>> GetRule(int id)
        {
            var ruleConfig = await _dbContext.RulesEngineConfigs.FindAsync(id);
            if (ruleConfig == null)
            {
                return NotFound();
            }
            return Ok(ruleConfig);
        }

        // POST: api/RulesManagement
        // Creates a new rule configuration.
        [HttpPost]
        public async Task<ActionResult<RulesEngineConfigs>> CreateRule(RulesEngineConfigs ruleConfig)
        {
            // Optionally, add validation here for your JSON rules format

            _dbContext.RulesEngineConfigs.Add(ruleConfig);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRule), new { id = ruleConfig.Id }, ruleConfig);
        }

        // PUT: api/RulesManagement/{id}
        // Updates an existing rule configuration.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRule(int id, RulesEngineConfigs ruleConfig)
        {
            if (id != ruleConfig.Id)
            {
                return BadRequest("ID mismatch");
            }

            _dbContext.Entry(ruleConfig).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _dbContext.RulesEngineConfigs.AnyAsync(r => r.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/RulesManagement/{id}
        // Deletes a rule configuration.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRule(int id)
        {
            var ruleConfig = await _dbContext.RulesEngineConfigs.FindAsync(id);
            if (ruleConfig == null)
            {
                return NotFound();
            }

            _dbContext.RulesEngineConfigs.Remove(ruleConfig);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/RulesManagement/workflow/{workflowName}
        // Optional: Retrieves rules configurations filtered by workflow name.
        [HttpGet("workflow/{workflowName}")]
        public async Task<ActionResult<IEnumerable<RulesEngineConfigs>>> GetRulesByWorkflow(string workflowName)
        {
            var rules = await _dbContext.RulesEngineConfigs
     .Where(r => r.WorkflowName == workflowName)
     .ToListAsync();


            return Ok(rules);
        }
    }
}
