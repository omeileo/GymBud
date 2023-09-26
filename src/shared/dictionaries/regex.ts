export const emojis = /[\uD800-\uDFFF]/g

export const expletives = /\b(damn|crap|hell|raas|bombo|claat|pussy|bloodclaat|fuck|fucking|suck|cunt|shit|bomboclaat|raasclaat|pussyclaat)\b/gi

export const expletiveWords = {
  regex: /[^!@#$%^&*]*(raas|bombo|claat|pussy|bloodclaat|fuck|suck|cunt|shit)[^!@#$%^&*]*/,
  errorMessage: 'Please remove expletives from your message before sending it.'
}

export const logEventNameVerificationRegex = {
  regex: /[^a-zA-Z0-9_]/g,
  errorMessage: 'Event name should contain 1 to 40 alphanumeric characters or underscores.'
}

export const dateFormatRegex = [
  {
    regex: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/,
    dateFormat: 'ISO 8601'
  },
  
  {
    regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/,
    dateFormat: 'yyyy-MM-dd HH:mm:ss.SSS'
  },

  {
    regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{2}$/,
    dateFormat: 'yyyy-MM-dd HH:mm:ss.SS'
  },

  {
    regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{1}$/,
    dateFormat: 'yyyy-MM-dd HH:mm:ss.S'
  },

  {
    regex: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    dateFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  
  {
    regex: /^\d{4}-\d{2}-\d{2}$/,
    dateFormat: 'yyyy-MM-dd'
  },

  {
    regex: /^(0?[1-9]|[12]\d|3[01])-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/,
    dateFormat: 'dd-MMM-yyyy'
  },

  {
    regex: /^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{4}$/,
    dateFormat: 'MMMM d, yyyy'
  },

  {
    regex: /^\d{2}:\d{2}:\d{2}\.\d{3}$/,
    dateFormat: 'HH:mm:ss.SSS'
  },

  {
    regex: /^\d{1,2}:\d{2}\s(?:AM|PM)$/i,
    dateFormat: 'h:mm a'
  }
]
