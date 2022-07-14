/**
 * elizabot.js v.1.1 - ELIZA JS library (N.Landsteiner 2005)
 * Eliza is a mock Rogerian psychotherapist.
 * Original program by Joseph Weizenbaum in MAD-SLIP for "Project MAC" at MIT.
 * cf: Weizenbaum, Joseph "ELIZA - A Computer Program For the Study of Natural Language Communication Between Man and Machine"
 * in: Communications of the ACM; Volume 9 , Issue 1 (January 1966): p 36-45.
 * JavaScript implementation by Norbert Landsteiner 2005; <http://www.masserk.at>
 *
 * `ElizaBot' is also a general chatbot engine that can be supplied with any rule set.
 * (for required data structures cf. "elizadata.js" and/or see the documentation.)
 * data is parsed and transformed for internal use at the creation time of the first instance of the `ElizaBot' constructor.
 *
 * JavaScript source: https://github.com/natelewis/eliza-as-promised
 */

interface IResponse {
  final?: string;
  reply?: string;
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';

import { IChatMessage } from '../../interfaces/chat.interface';
import { elizaData, IElizaData } from './config/data.config';
import { IKeyword } from './config/keywords.config';

@Injectable({
  providedIn: 'root',
})
export class AppElizaService {
  private readonly noRandomSubject = new BehaviorSubject<boolean>(false);

  public capitalizeFirstLetter = true;

  public debug = false;

  public memSize = 20;

  private data?: IElizaData;

  public quit = false;

  public mem: string[] = [];

  public lastChoice: number[][] = [];

  public postExp = new RegExp('');

  public preExp = new RegExp('');

  public pres: Record<string, string> = {};

  public posts: Record<string, string> = {};

  public sentence = '';

  private readonly messagesSubject = new BehaviorSubject<IChatMessage[]>([]);

  public readonly messages$ = this.messagesSubject.asObservable().pipe(shareReplay());

  constructor() {
    this.setup();
  }

  public nextMessage(message: IChatMessage) {
    this.messagesSubject.next([...this.messagesSubject.value, message]);
  }

  public setup(noRandomFlag = false) {
    this.noRandomSubject.next(noRandomFlag);
    this.capitalizeFirstLetter = true;
    this.debug = false;
    this.memSize = 20;
    if (typeof this.data === 'undefined') {
      this.init();
    }
    this.reset();
  }

  public reset() {
    if (typeof this.data === 'undefined') {
      throw new Error('Initialize Eliza first.');
    }
    this.quit = false;
    this.mem = [];
    this.lastChoice = [];
    for (let k = 0; k < this.data.keywords.length; k += 1) {
      this.lastChoice[k] = [];
      const rules = this.data.keywords[k].rules;
      for (let i = 0; i < rules.length; i += 1) {
        this.lastChoice[k][i] = -1;
      }
    }
    this.messagesSubject.next([{ bot: true, text: this.getInitial() }]);
  }

  // eslint-disable-next-line max-lines-per-function, complexity -- TODO refactor
  private init() {
    this.data = { ...elizaData };
    // parse data and convert it from canonical form to internal use
    // produce synonym list
    const synPatterns: Record<string, string> = {};
    for (const item in this.data.synonyms) {
      if (item) {
        synPatterns[item] = `(${item}|${this.data.synonyms[item].join('|')})`;
      }
    }
    // check for keywords or install empty structure to prevent any errors
    if (this.data.keywords.length === 0) {
      this.data.keywords = [
        {
          index: 0,
          key: '###',
          rank: 0,
          rules: [
            {
              pattern: '###',
              options: [],
              memory: false,
            },
          ],
        },
      ];
    }
    // 1st convert rules to regexps
    // expand synonyms and insert asterisk expressions for backtracking
    const sre = /@(\S+)/;
    const are = /(\S)\s*\*\s*(\S)/;
    const are1 = /^\s*\*\s*(\S)/;
    const are2 = /(\S)\s*\*\s*$/;
    const are3 = /^\s*\*\s*$/;
    const wsre = /\s+/g;
    for (let i = 0; i < this.data.keywords.length; i += 1) {
      const rules = this.data.keywords[i].rules;
      for (let j = 0; j < rules.length; j += 1) {
        const rule = rules[j];
        // check mem flag and store it as decomp's element 2
        if (rule.pattern.charAt(0) === '$') {
          let ofs = 1;
          while (rule.pattern.charAt[ofs] === ' ') {
            ofs += 1;
          }
          rule.pattern = rule.pattern.substring(ofs);
          rule.memory = true;
        } else {
          rule.memory = false;
        }
        let match = rule.pattern.match(sre);
        while (match !== null) {
          const sp = synPatterns[match[1]] ? synPatterns[match[1]] : match[1];
          rule.pattern = rule.pattern.substring(0, match.index ?? 0) + sp + rule.pattern.substring((match.index ?? 0) + match[0].length);
          match = rule.pattern.match(sre);
        }
        // expand asterisk expressions
        if (are3.test(rule.pattern)) {
          rule.pattern = '\\s*(.*)\\s*';
        } else {
          match = rule.pattern.match(are);
          if (match !== null) {
            let leftPart = '';
            let rightPart = rule.pattern;
            while (match !== null) {
              leftPart += rightPart.substring(0, (match.index ?? 0) + 1);
              if (match[1] !== ')') {
                leftPart += '\\b';
              }
              leftPart += '\\s*(.*)\\s*';
              if (match[2] !== '(' && match[2] !== '\\') {
                leftPart += '\\b';
              }
              leftPart += match[2];
              rightPart = rightPart.substring((match.index ?? 0) + match[0].length);
              match = rightPart.match(are);
            }
            rule.pattern = leftPart + rightPart;
          }
          match = rule.pattern.match(are1);
          if (match !== null) {
            let leftPart = '\\s*(.*)\\s*';
            if (match[1] !== ')' && match[1] !== '\\') {
              leftPart += '\\b';
            }
            rule.pattern = leftPart + rule.pattern.substring((match.index ?? 0) - 1 + match[0].length);
          }
          match = rule.pattern.match(are2);
          if (match !== null) {
            let leftPart = rule.pattern.substring(0, (match.index ?? 0) + 1);
            if (match[1] !== '(') {
              leftPart += '\\b';
            }
            rule.pattern = leftPart + '\\s*(.*)\\s*';
          }
        }
        // expand white space
        rule.pattern = rule.pattern.replace(wsre, '\\s+');
        wsre.lastIndex = 0;
      }
    }
    // now sort keywords by rank (highest first)
    this.data.keywords.sort(this.sortKeywords);
    // and compose regexps and refs for pres and posts
    this.pres = {};
    this.posts = {};
    if (this.data.pres.length > 0) {
      const a = [];
      for (let i = 0; i < this.data.pres.length; i += 2) {
        a.push(this.data.pres[i]);
        this.pres[this.data.pres[i]] = this.data.pres[i + 1];
      }
      this.preExp = new RegExp('\\b(' + a.join('|') + ')\\b');
    } else {
      // default (should not match)
      this.preExp = /####/;
      this.pres['####'] = '####';
    }
    if (this.data.posts.length > 0) {
      const a = [];
      for (let i = 0; i < this.data.posts.length; i += 2) {
        a.push(this.data.posts[i]);
        this.posts[this.data.posts[i]] = this.data.posts[i + 1];
      }
      this.postExp = new RegExp('\\b(' + a.join('|') + ')\\b');
    } else {
      // default (should not match)
      this.postExp = /####/;
      this.posts['####'] = '####';
    }
  }

  // eslint-disable-next-line max-lines-per-function, complexity -- TODO refactor
  private execRule(k: number): string {
    if (typeof this.data === 'undefined') {
      throw new Error('Initialize Eliza first.');
    }
    const rules = this.data.keywords[k].rules;
    const paramRegExp = /\(([0-9]+)\)/;
    for (let i = 0; i < rules.length; i += 1) {
      const match = this.sentence.match(rules[i].pattern);
      if (match !== null) {
        const options = rules[i].options;
        const memory = rules[i].memory;
        let optionIndex = this.noRandomSubject.value ? 0 : Math.floor(Math.random() * options.length);
        if ((this.noRandomSubject.value && this.lastChoice[k][i] > optionIndex) || this.lastChoice[k][i] === optionIndex) {
          this.lastChoice[k][i] += 1;
          optionIndex = this.lastChoice[k][i];
          if (optionIndex >= options.length) {
            optionIndex = 0;
            this.lastChoice[k][i] = -1;
          }
        } else {
          this.lastChoice[k][i] = optionIndex;
        }
        let reply = options[optionIndex];
        if (this.debug) {
          const debugLog = `match:\nkey: ${this.data.keywords[k].key}\nrank: ${this.data.keywords[k].rank}\ndecomp: ${rules[i].pattern}\nreasmb: ${reply}\nmemory: ${memory}`;
          // eslint-disable-next-line no-console -- debug output
          console.warn('debugLog', debugLog);
        }
        if (reply.search('^goto ') === 0) {
          const key = reply.substring(5);
          const ki = this.getRuleIndexByKey(key);
          if (ki >= 0) {
            return this.execRule(ki);
          }
        }
        // substitute positional params
        let paramRegExpMatch = reply.match(paramRegExp);
        if (paramRegExpMatch) {
          let leftPart = '';
          let rightPart = reply;
          while (paramRegExpMatch !== null) {
            let param = match[parseInt(paramRegExpMatch[1], 10)];
            // postprocess param
            let postExpMatch = param.match(this.postExp);
            if (postExpMatch !== null) {
              let leftPart2 = '';
              let rightPart2 = param;
              while (postExpMatch !== null) {
                leftPart2 += rightPart2.substring(0, postExpMatch.index ?? 0) + this.posts[postExpMatch[1]];
                rightPart2 = rightPart2.substring((postExpMatch.index ?? 0) + postExpMatch[0].length);
                postExpMatch = rightPart2.match(this.postExp);
              }
              param = leftPart2 + rightPart2;
            }
            leftPart += rightPart.substring(0, paramRegExpMatch.index) + param;
            rightPart = rightPart.substring((paramRegExpMatch.index ?? 0) + paramRegExpMatch[0].length);
            paramRegExpMatch = rightPart.match(paramRegExp);
          }
          reply = leftPart + rightPart;
        }
        const transformedReply = this.postTransform(reply);
        if (memory) {
          this.memSave(transformedReply);
        } else {
          return transformedReply;
        }
      }
    }
    return '';
  }

  // eslint-disable-next-line max-lines-per-function, complexity -- TODO refactor
  private transform(input: string) {
    if (typeof this.data === 'undefined') {
      throw new Error('Initialize Eliza first.');
    }
    let reply = '';
    this.quit = false;
    // unify text string and split text in part sentences and loop through them
    const parts = input
      .toLowerCase()
      .replace(/@#\$%\^&\*\(\)_\+=~`\{\[\}\]\|:;<>\/\\\t/g, ' ')
      .replace(/\s+-+\s+/g, '.')
      .replace(/\s*[,.?!;]+\s*/g, '.')
      .replace(/\s*\bbut\b\s*/g, '.')
      .replace(/\s{2,}/g, ' ')
      .split('.');
    for (let i = 0; i < parts.length; i += 1) {
      let part = parts[i];
      if (part !== '') {
        // check for quit expression
        for (let q = 0; q < this.data.quits.length; q += 1) {
          if (this.data.quits[q] === part) {
            this.quit = true;
            return this.getFinal();
          }
        }
        let match = part.match(this.preExp);
        if (match !== null) {
          let leftPart = '';
          let rightPart = part;
          while (match !== null) {
            leftPart += rightPart.substring(0, match.index ?? 0) + this.pres[match[1]];
            rightPart = rightPart.substring((match.index ?? 0) + match[0].length);
            match = rightPart.match(this.preExp);
          }
          part = leftPart + rightPart;
        }
        this.sentence = part;
        // loop trough keywords
        for (let k = 0; k < this.data.keywords.length; k += 1) {
          if (part.search(new RegExp('\\b' + this.data.keywords[k].key + '\\b', 'i')) >= 0) {
            reply = this.execRule(k);
          }
          if (reply !== '') {
            return reply;
          }
        }
      }
    }
    // nothing matched try mem
    reply = this.memGet();
    // if nothing in mem, try xnone
    if (reply === '') {
      this.sentence = ' ';
      const k = this.getRuleIndexByKey('xnone');
      reply = k >= 0 ? this.execRule(k) : reply;
    }
    // return reply or default string
    return reply !== '' ? reply : 'I am at a loss for words.';
  }

  private sortKeywords(a: IKeyword, b: IKeyword) {
    if (a.rank > b.rank) {
      // sort by rank
      return -1;
    } else if (a.rank < b.rank) {
      return 1;
    } else if (a.index > b.index) {
      // or original index
      return 1;
    } else if (a.index < b.index) {
      return -1;
    }
    return 0;
  }

  private postTransform(input: string) {
    if (typeof this.data === 'undefined') {
      throw new Error('Initialize Eliza first.');
    }
    // final cleanings
    let result = input.replace(/\s{2,}/g, ' ').replace(/\s+\./g, '.');
    if (this.data.postTransforms.length > 0) {
      for (let i = 0; i < this.data.postTransforms.length; i += 1) {
        const postTransform = this.data.postTransforms[i];
        result = result.replace(postTransform.searchValue, postTransform.replaceValue);
        this.data.postTransforms[i].searchValue.lastIndex = 0;
      }
    }
    if (this.capitalizeFirstLetter) {
      const match = result.match(/^([a-z])/);
      if (match) {
        result = match[0].toUpperCase() + result.substring(1);
      }
    }
    return result;
  }

  private getRuleIndexByKey(key: string) {
    if (typeof this.data === 'undefined') {
      throw new Error('Initialize Eliza first.');
    }
    for (let k = 0; k < this.data.keywords.length; k += 1) {
      if (this.data.keywords[k].key === key) {
        return k;
      }
    }
    return -1;
  }

  private memSave(input: string) {
    this.mem.push(input);
    if (this.mem.length > this.memSize) {
      this.mem.shift();
    }
  }

  private memGet() {
    if (this.mem.length > 0) {
      if (this.noRandomSubject.value) {
        return this.mem.shift() ?? '';
      }
      const n = Math.floor(Math.random() * this.mem.length);
      const reply = this.mem[n];
      for (let i = n + 1; i < this.mem.length; i += 1) {
        this.mem[i - 1] = this.mem[i];
      }
      this.mem.length -= 1;
      return reply;
    }
    return '';
  }

  private getFinal() {
    if (typeof this.data === 'undefined') {
      throw new Error('Initialize Eliza first.');
    }
    return this.data.finals.length === 0 ? '' : this.data.finals[Math.floor(Math.random() * this.data.finals.length)];
  }

  private getInitial() {
    if (typeof this.data === 'undefined') {
      throw new Error('Initialize Eliza first.');
    }
    return this.data.initials.length === 0 ? '' : this.data.initials[Math.floor(Math.random() * this.data.initials.length)];
  }

  public getResponse(statement: string) {
    return new Promise<IResponse>(resolve => {
      const elizaReply = this.transform(statement);
      if (this.quit) {
        resolve({ final: this.getFinal() });
      } else {
        resolve({ reply: elizaReply });
      }
    });
  }
}
