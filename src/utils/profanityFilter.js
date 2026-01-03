import LeoProfanity from 'leo-profanity';
import filipinoBadwords from 'filipino-badwords-list';

class ProfanityFilter {
  constructor() {
    this.setupFilter();
  }

  setupFilter() {
    LeoProfanity.clearList();
    LeoProfanity.add(LeoProfanity.getDictionary('en'));
    
    LeoProfanity.add(filipinoBadwords);
    
    const additionalFilipino = [
      'gago', 'tanga', 'bobo', 'ulol', 'puta', 'putang', 'ina', 'putangina', 
      'tangina', 'kingina', 'hayop', 'leche', 'peste', 'bwisit', 'hudas', 'depota', 'fck', 'f@ck', 'gaga'
    ];
    LeoProfanity.add(additionalFilipino);
  }

  filterText(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }
    
    let filtered = LeoProfanity.clean(text);
    
    const patterns = [
      { regex: /f[@*#$%&!uck4]+[ck]*[ing]*/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /s[@*#$%&!hit4]+[t]*/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /b[@*#$%&!o0]+b[s]*/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /t[i1!@*#$%&]+t[s5$]*/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /d[i1!@*#$%&]+ck/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /c[o0@*#$%&!]+ck/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /p[u@*#$%&!]+ss[y]*/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /[@*#$%&!a4]+ss\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /[@*#$%&!a4]+s[s5$]+/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /d[@*#$%&!amn4]+/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /h[@*#$%&!ell4]+/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /[a@*#$%&!4]+s[s5$]*[h]*[o0]+le/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /b[i1!]+tc[h]+/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /g[a@*#$%&!4]+g[o0]+/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /t[a@*#$%&!4]+ng[a@*#$%&!4]+/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /b[o0]+b[o0]+/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /p[u]+t[a@*#$%&!4]+/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /[u]+l[o0]+l/gi, replacement: (match) => '*'.repeat(match.length) }
    ];
    
    patterns.forEach(pattern => {
      filtered = filtered.replace(pattern.regex, pattern.replacement);
    });
    
    const filipinoWords = ['gago', 'tanga', 'bobo', 'puta', 'putang ina', 'tangina', 'putangina'];
    
    filipinoWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    
    return filtered;
  }

  containsProfanity(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }
    
    if (LeoProfanity.check(text)) {
      return true;
    }
    
    const patterns = [
      /f[@*#$%&!uck4]+[ck]*/gi,
      /s[@*#$%&!hit4]+[t]*/gi,
      /b[@*#$%&!o0]+b[s]*/gi,
      /t[i1!@*#$%&]+t[s5$]*/gi,
      /d[i1!@*#$%&]+ck/gi,
      /c[o0@*#$%&!]+ck/gi,
      /p[u@*#$%&!]+ss[y]*/gi,
      /[@*#$%&!a4]+ss\b/gi,
      /[@*#$%&!a4]+s[s5$]+/gi,
      /d[@*#$%&!amn4]+/gi,
      /[a@*#$%&!4]+s[s5$]*[h]*[o0]+le/gi,
      /b[i1!]+tc[h]+/gi,
      /g[a@*#$%&!4]+g[o0]+/gi,
      /t[a@*#$%&!4]+ng[a@*#$%&!4]+/gi,
      /b[o0]+b[o0]+/gi,
      /p[u]+t[a@*#$%&!4]+/gi
    ];
    
    const hasPatternMatch = patterns.some(pattern => pattern.test(text));
    if (hasPatternMatch) return true;
    
    const filipinoWords = ['gago', 'tanga', 'bobo', 'puta', 'putang', 'tangina', 'putangina'];
    const textLower = text.toLowerCase();
    
    return filipinoWords.some(word => textLower.includes(word));
  }

  moderateContent(text) {
    const hasProfanity = this.containsProfanity(text);
    const filtered = this.filterText(text);
    
    return {
      filtered,
      flagged: hasProfanity,
      reason: hasProfanity ? 'Contains profanity' : 'Clean'
    };
  }
}

const profanityFilter = new ProfanityFilter();

export const filterText = (text) => profanityFilter.filterText(text);
export const containsProfanity = (text) => profanityFilter.containsProfanity(text);
export const moderateContent = (text) => profanityFilter.moderateContent(text);

export default profanityFilter;