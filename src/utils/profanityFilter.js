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
      'tangina', 'kingina', 'hayop', 'leche', 'peste', 'bwisit', 'hudas', 'depota', 'fck', 'f@ck', 'gaga', 'pota', 'putek', 'tangek', 'gagu', 'gagi', 
      'gaghi', 'puki', 'kupal', 'tarantado', 'tarantada', 'tonto', 'tonta', 'bastard', 'bastarda', 
      'anak ng puta', 'anak ng pucha', 'putang ina mo', 'putangina mo', 'tangina mo', 'kingina mo', 'hayop ka', 'leche ka', 'peste ka', 'bwisit ka', 'hudas ka', 'depota ka', 'g@g@', 'g@ga', 'p@ta', 'p@tek', 't@ngek', 'p@ki'
    ];
    LeoProfanity.add(additionalFilipino);
  }

  filterText(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }
    
    let filtered = LeoProfanity.clean(text);
    
    const patterns = [
      { regex: /\bf[@*#$%&!uck4]+[ck]*[ing]*\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bs[@*#$%&!hit4]+[t]*\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bb[@*#$%&!o0]+b[s]*\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bt[i1!@*#$%&]+t[s5$]*\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bd[i1!@*#$%&]+ck\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bc[o0@*#$%&!]+ck\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bp[u@*#$%&!]+ss[y]*\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\b[@*#$%&!a4]+ss\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bd[@*#$%&!amn4]+\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bh[@*#$%&!ell4]+\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\b[a@*#$%&!4]+s[s5$]*h[o0]+le\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bb[i1!]+tc[h]+\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bg[a@*#$%&!4]+g[o0]+\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bt[a@*#$%&!4]+ng[a@*#$%&!4]+\b/gi, replacement: (match) => '*'.repeat(match.length) },
      { regex: /\bp[u]+t[a@*#$%&!4]+\b/gi, replacement: (match) => '*'.repeat(match.length) }
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
      /\bf[@*#$%&!uck4]+[ck]*\b/gi,
      /\bs[@*#$%&!hit4]+[t]*\b/gi,
      /\bb[@*#$%&!o0]+b[s]*\b/gi,
      /\bt[i1!@*#$%&]+t[s5$]*\b/gi,
      /\bd[i1!@*#$%&]+ck\b/gi,
      /\bc[o0@*#$%&!]+ck\b/gi,
      /\bp[u@*#$%&!]+ss[y]*\b/gi,
      /\b[@*#$%&!a4]+ss\b/gi,
      /\bd[@*#$%&!amn4]+\b/gi,
      /\b[a@*#$%&!4]+s[s5$]*h[o0]+le\b/gi,
      /\bb[i1!]+tc[h]+\b/gi,
      /\bg[a@*#$%&!4]+g[o0]+\b/gi,
      /\bt[a@*#$%&!4]+ng[a@*#$%&!4]+\b/gi,
      /\bp[u]+t[a@*#$%&!4]+\b/gi
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