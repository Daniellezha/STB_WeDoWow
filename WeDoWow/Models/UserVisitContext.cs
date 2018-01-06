using System.Collections.Generic;

namespace WeDoWow.Models
{
    public class UserVisitContext
    {
        public List<string> PreferredLanguages { get; set; }

        public bool DefaultPreferredLanguage { get; set; }
    }
}
