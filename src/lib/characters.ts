// 字典数据与查询工具函数
export type CharacterRecord = {
  char: string;
  pinyin: string[];
  radical: string;
  strokeCount: number;
  meanings: string[];
  words: string[];
  sentences: string[];
  frequencyRank?: number;
  hskLevel?: number;
};

export const CHARACTERS: CharacterRecord[] = [
  {
    char: "学",
    pinyin: ["xué"],
    radical: "子",
    strokeCount: 8,
    meanings: ["学习、研究", "学问、学业"],
    words: ["学习", "学生", "学术"],
    sentences: ["我喜欢学习中文。", "他是大学的交换学生。"],
    hskLevel: 1,
    frequencyRank: 140,
  },
  {
    char: "海",
    pinyin: ["hǎi"],
    radical: "氵",
    strokeCount: 10,
    meanings: ["大海、海洋", "比喻广阔、众多"],
    words: ["大海", "海外", "海量"],
    sentences: ["我们去海边散步。", "读书要有海纳百川的胸怀。"],
    frequencyRank: 430,
  },
  {
    char: "树",
    pinyin: ["shù"],
    radical: "木",
    strokeCount: 9,
    meanings: ["木本植物", "建立、树立"],
    words: ["树木", "树立", "大树"],
    sentences: ["院子里有一棵高大的树。", "要树立远大的目标。"],
    frequencyRank: 520,
  },
  {
    char: "明",
    pinyin: ["míng"],
    radical: "日",
    strokeCount: 8,
    meanings: ["明亮", "明天", "明白、清楚"],
    words: ["明亮", "明天", "说明"],
    sentences: ["今天的月亮很明亮。", "说明书写得很明白。"],
    frequencyRank: 100,
  },
  {
    char: "爱",
    pinyin: ["ài"],
    radical: "爫",
    strokeCount: 10,
    meanings: ["喜爱、热爱", "爱情、关怀"],
    words: ["爱心", "可爱", "热爱"],
    sentences: ["我爱汉语。", "要用爱心对待他人。"],
    hskLevel: 1,
    frequencyRank: 90,
  },
  {
    char: "水",
    pinyin: ["shuǐ"],
    radical: "水",
    strokeCount: 4,
    meanings: ["水、液体", "河流、湖泊等水域"],
    words: ["水流", "水源", "水利"],
    sentences: ["每天要多喝水。", "这里的水很清澈。"],
    hskLevel: 1,
    frequencyRank: 50,
  },
  {
    char: "中",
    pinyin: ["zhōng", "zhòng"],
    radical: "丨",
    strokeCount: 4,
    meanings: ["中央、中间", "中国", "命中"],
    words: ["中国", "中心", "命中"],
    sentences: ["北京在中国的北方。", "箭正中靶心。"],
    hskLevel: 1,
    frequencyRank: 5,
  },
  {
    char: "友",
    pinyin: ["yǒu"],
    radical: "又",
    strokeCount: 4,
    meanings: ["朋友、友好"],
    words: ["朋友", "友好", "友谊"],
    sentences: ["我们是好朋友。", "保持友好关系很重要。"],
    hskLevel: 1,
    frequencyRank: 300,
  },
  {
    char: "红",
    pinyin: ["hóng"],
    radical: "纟",
    strokeCount: 6,
    meanings: ["红色", "象征喜庆、热烈"],
    words: ["红色", "红旗", "红茶"],
    sentences: ["她穿着一件红衣服。", "过年时家家户户贴红对联。"],
    hskLevel: 2,
    frequencyRank: 260,
  },
];

export const recommendedList = CHARACTERS.slice(0, 6);

export function searchCharacters(keyword: string): CharacterRecord[] {
  const raw = keyword.trim();
  const normalized = raw.toLowerCase();
  if (!raw) return [];

  // 移除声调的辅助函数
  const removeTone = (pinyin: string): string => {
    return pinyin
      .replace(/[āáǎà]/g, 'a')
      .replace(/[ēéěè]/g, 'e')
      .replace(/[īíǐì]/g, 'i')
      .replace(/[ōóǒò]/g, 'o')
      .replace(/[ūúǔù]/g, 'u')
      .replace(/[ǖǘǚǜü]/g, 'v');
  };

  const normalizePinyin = (value: string): string => {
    return removeTone(value.toLowerCase())
      .replace(/[0-5]/g, "")
      .replace(/[^a-zv\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const queryPinyin = normalizePinyin(normalized);
  const querySyllable = queryPinyin.split(/\s+/)[0] ?? "";

  const matches = CHARACTERS.flatMap((item) => {
    const hitsChar = item.char.includes(raw);

    let bestPinyinScore: number | null = null;
    if (querySyllable) {
      for (const p of item.pinyin) {
        const pinyinNormalized = normalizePinyin(p);
        if (!pinyinNormalized) continue;

        let score: number | null = null;
        if (pinyinNormalized === querySyllable) {
          score = 0; // 精确匹配：hong == hong
        } else if (pinyinNormalized.startsWith(querySyllable)) {
          score = 1; // 前缀匹配：ho -> hong（避免 hong 匹配 zhong 这类“中间命中”）
        }

        if (score !== null) {
          bestPinyinScore = bestPinyinScore === null ? score : Math.min(bestPinyinScore, score);
        }
      }
    }

    const hitsPinyin = bestPinyinScore !== null;
    if (!hitsChar && !hitsPinyin) return [];

    const frequencyRank = item.frequencyRank ?? Number.POSITIVE_INFINITY;
    const primaryScore = hitsChar ? -1 : (bestPinyinScore ?? 2);

    return [{ item, primaryScore, frequencyRank }];
  });

  matches.sort((a, b) => {
    if (a.primaryScore !== b.primaryScore) return a.primaryScore - b.primaryScore;
    if (a.frequencyRank !== b.frequencyRank) return a.frequencyRank - b.frequencyRank;
    return a.item.char.localeCompare(b.item.char, "zh");
  });

  return matches.map((m) => m.item);
}

export function getCharacterByChar(char: string): CharacterRecord | undefined {
  return CHARACTERS.find((item) => item.char === char);
}
