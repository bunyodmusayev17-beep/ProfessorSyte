namespace WebSyteProffessor.Exceptions;

public class ConflictException : Exception
{
    public Dictionary<string, string> Errors { get; }

    public ConflictException(string message) : base(message)
    {
        Errors = new Dictionary<string, string>();
    }

    public ConflictException(Dictionary<string, string> errors) : base("Conflict occurred")
    {
        Errors = errors;
    }
}