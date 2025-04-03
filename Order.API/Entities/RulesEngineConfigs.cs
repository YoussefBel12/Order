public class RulesEngineConfigs
{
    public int Id { get; set; }
    public string Version { get; set; }
    public string WorkflowName { get; set; }
    public string Rules { get; set; } // JSON stored as string
    public bool IsActive { get; set; }  // Default to true
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
