using System.ComponentModel.DataAnnotations;

public class RulesEngineConfigs
{
    public int Id { get; set; }
    [Required]
    public  required string Version { get; set; }
    [Required]
    public required string WorkflowName { get; set; }
    [Required]
    public required string Rules { get; set; } // JSON stored as string
    public bool IsActive { get; set; }  // Default to true
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;


    // New fields
    public DateTime? ExpirationDate { get; set; }  // Null = no expiration
    public bool IsArchived { get; set; } = false;  // Set true after expiration if archiving instead of deleting

}
