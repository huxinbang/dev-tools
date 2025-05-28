"use client"

import { createContext, useContext } from "react"

export type Language = "en" | "zh" | "fr"

export interface Translations {
  common: {
    copy: string
    clear: string
    clearHistory: string
    input: string
    output: string
    encode: string
    decode: string
    convert: string
    format: string
    validate: string
    sample: string
    use: string
    search: string
    loading: string
    error: string
    success: string
    copied: string
    invalid: string
    valid: string
  }
  sidebar: {
    title: string
    base64: {
      name: string
      description: string
    }
    url: {
      name: string
      description: string
    }
    timestamp: {
      name: string
      description: string
    }
    base64Hex: {
      name: string
      description: string
    }
    json: {
      name: string
      description: string
    }
    yaml: {
      name: string
      description: string
    }
  }
  base64: {
    title: string
    description: string
    inputHex: string
    hexSample: string
    binarySample: string
    inputPlaceholder: string
    outputPlaceholder: string
    encodedResult: string
    decodedResult: string
    binaryDetected: string
    binaryDescription: string
    invalidBase64: string
    invalidHex: string
    failedEncode: string
  }
  timestamp: {
    title: string
    description: string
    timezoneSettings: string
    selectTimezone: string
    currentOffset: string
    currentTime: string
    currentTimestamp: string
    currentDateTime: string
    enterTimestamp: string
    enterDateTime: string
    convertToDate: string
    convertToTimestamp: string
    otherTimezones: string
    sameTimestamp: string
    invalidTimestamp: string
    invalidDate: string
  }
  json: {
    title: string
    description: string
    indentSize: string
    insertSample: string
    validJson: string
    invalidJson: string
    inputJson: string
    inputDescription: string
    formattedOutput: string
    outputDescription: string
    minify: string
    copyFormatted: string
  }
  yaml: {
    title: string
    description: string
    insertSample: string
    validYaml: string
    invalidYaml: string
    inputDescription: string
    outputDescription: string
    yamlToJson: string
    jsonToYaml: string
    clearAll: string
  }
  url: {
    title: string
    description: string
    enterText: string
    enterEncoded: string
    urlEncoded: string
    decodedText: string
  }
  base64Hex: {
    title: string
    description: string
    base64ToHex: string
    hexToBase64: string
    enterBase64: string
    enterHex: string
    hexResult: string
    base64Result: string
  }
  messages: {
    historyCleared: string
    historyClearedDesc: string
    copiedToClipboard: string
    failedToCopy: string
    outputCopied: string
    timestampCopied: string
    datetimeCopied: string
    formattedJsonCopied: string
  }
}

const translations: Record<Language, Translations> = {
  en: {
    common: {
      copy: "Copy",
      clear: "Clear",
      clearHistory: "Clear History",
      input: "Input",
      output: "Output",
      encode: "Encode",
      decode: "Decode",
      convert: "Convert",
      format: "Format",
      validate: "Validate",
      sample: "Sample",
      use: "Use",
      search: "Search",
      loading: "Loading",
      error: "Error",
      success: "Success",
      copied: "Copied!",
      invalid: "Invalid",
      valid: "Valid",
    },
    sidebar: {
      title: "Dev Tools",
      base64: {
        name: "Base64 Encoder/Decoder",
        description: "Encode and decode Base64 strings",
      },
      url: {
        name: "URL Encoder/Decoder",
        description: "Encode and decode URL components",
      },
      timestamp: {
        name: "Unix Timestamp",
        description: "Convert Unix timestamps",
      },
      base64Hex: {
        name: "Base64 to Hex",
        description: "Convert between Base64 and Hex",
      },
      json: {
        name: "JSON Formatter",
        description: "Format and manipulate JSON",
      },
      yaml: {
        name: "YAML Validator",
        description: "Validate and format YAML",
      },
    },
    base64: {
      title: "Base64 Encoder/Decoder",
      description: "Encode text or binary data to Base64, or decode Base64 strings back to text/binary",
      inputHex: "Input is hex string",
      hexSample: "Insert Hex Sample",
      binarySample: "Insert Binary Sample",
      inputPlaceholder: "Result will appear here...",
      outputPlaceholder: "Result will appear here...",
      encodedResult: "Base64 encoded result",
      decodedResult: "Decoded text result",
      binaryDetected: "Binary data (hex dump with ASCII)",
      binaryDescription:
        "Binary data detected: Showing hex dump with offsets and ASCII representation. Non-printable characters are shown as dots (.).",
      invalidBase64: "Invalid Base64 string. Please check your input.",
      invalidHex: "Invalid hex string",
      failedEncode: "Failed to encode",
    },
    timestamp: {
      title: "Unix Timestamp Converter",
      description: "Convert between Unix timestamps and human-readable dates with timezone support",
      timezoneSettings: "Timezone Settings",
      selectTimezone: "Select Timezone",
      currentOffset: "Current offset",
      currentTime: "Current Time",
      currentTimestamp: "Current Unix Timestamp",
      currentDateTime: "Current Date & Time",
      enterTimestamp: "Enter Unix timestamp (seconds since epoch)",
      enterDateTime: "Enter date and time in selected timezone",
      convertToDate: "Convert to Date",
      convertToTimestamp: "Convert to Timestamp",
      otherTimezones: "Other Timezones",
      sameTimestamp: "Same timestamp in different timezones",
      invalidTimestamp: "Invalid timestamp format",
      invalidDate: "Invalid date format",
    },
    json: {
      title: "JSON Formatter & Validator",
      description: "Format, validate, and manipulate JSON data with syntax highlighting",
      indentSize: "Indent Size:",
      insertSample: "Insert Sample",
      validJson: "Valid JSON",
      invalidJson: "Invalid JSON",
      inputJson: "Input JSON",
      inputDescription: "Paste your JSON data here to format and validate",
      formattedOutput: "Formatted Output",
      outputDescription: "Formatted and validated JSON result",
      minify: "Minify",
      copyFormatted: "Copy Formatted JSON",
    },
    yaml: {
      title: "YAML Validator & Formatter",
      description: "Validate, format YAML data and convert to/from JSON",
      insertSample: "Insert Sample",
      validYaml: "Valid YAML",
      invalidYaml: "Invalid YAML",
      inputDescription: "Paste your YAML or JSON data here",
      outputDescription: "Formatted YAML, JSON result, or validation status",
      yamlToJson: "YAML → JSON",
      jsonToYaml: "JSON → YAML",
      clearAll: "Clear All",
    },
    url: {
      title: "URL Component Encoder/Decoder",
      description: "Encode or decode URL components for safe transmission in URLs",
      enterText: "Enter text to URL encode",
      enterEncoded: "Enter URL encoded string to decode",
      urlEncoded: "URL encoded result",
      decodedText: "Decoded text result",
    },
    base64Hex: {
      title: "Base64 ↔ Hex Converter",
      description: "Convert between Base64 and hexadecimal representations",
      base64ToHex: "Base64 → Hex",
      hexToBase64: "Hex → Base64",
      enterBase64: "Enter Base64 string",
      enterHex: "Enter hexadecimal string",
      hexResult: "Hexadecimal result",
      base64Result: "Base64 result",
    },
    messages: {
      historyCleared: "History Cleared",
      historyClearedDesc: "All saved data has been cleared",
      copiedToClipboard: "Output copied to clipboard",
      failedToCopy: "Failed to copy to clipboard",
      outputCopied: "Output copied to clipboard",
      timestampCopied: "Timestamp copied to clipboard",
      datetimeCopied: "Datetime copied to clipboard",
      formattedJsonCopied: "Formatted JSON copied to clipboard",
    },
  },
  zh: {
    common: {
      copy: "复制",
      clear: "清除",
      clearHistory: "清除历史",
      input: "输入",
      output: "输出",
      encode: "编码",
      decode: "解码",
      convert: "转换",
      format: "格式化",
      validate: "验证",
      sample: "示例",
      use: "使用",
      search: "搜索",
      loading: "加载中",
      error: "错误",
      success: "成功",
      copied: "已复制！",
      invalid: "无效",
      valid: "有效",
    },
    sidebar: {
      title: "开发工具",
      base64: {
        name: "Base64 编码/解码",
        description: "编码和解码 Base64 字符串",
      },
      url: {
        name: "URL 编码/解码",
        description: "编码和解码 URL 组件",
      },
      timestamp: {
        name: "Unix 时间戳",
        description: "转换 Unix 时间戳",
      },
      base64Hex: {
        name: "Base64 转十六进制",
        description: "Base64 和十六进制之间转换",
      },
      json: {
        name: "JSON 格式化",
        description: "格式化和处理 JSON",
      },
      yaml: {
        name: "YAML 验证器",
        description: "验证和格式化 YAML",
      },
    },
    base64: {
      title: "Base64 编码/解码器",
      description: "将文本或二进制数据编码为 Base64，或将 Base64 字符串解码回文本/二进制",
      inputHex: "输入是十六进制字符串",
      hexSample: "插入十六进制示例",
      binarySample: "插入二进制示例",
      inputPlaceholder: "结果将在这里显示...",
      outputPlaceholder: "结果将在这里显示...",
      encodedResult: "Base64 编码结果",
      decodedResult: "解码文本结果",
      binaryDetected: "二进制数据（带 ASCII 的十六进制转储）",
      binaryDescription: "检测到二进制数据：显示带偏移量和 ASCII 表示的十六进制转储。不可打印字符显示为点（.）。",
      invalidBase64: "无效的 Base64 字符串。请检查您的输入。",
      invalidHex: "无效的十六进制字符串",
      failedEncode: "编码失败",
    },
    timestamp: {
      title: "Unix 时间戳转换器",
      description: "在 Unix 时间戳和人类可读日期之间转换，支持时区",
      timezoneSettings: "时区设置",
      selectTimezone: "选择时区",
      currentOffset: "当前偏移",
      currentTime: "当前时间",
      currentTimestamp: "当前 Unix 时间戳",
      currentDateTime: "当前日期和时间",
      enterTimestamp: "输入 Unix 时间戳（自纪元以来的秒数）",
      enterDateTime: "在选定时区输入日期和时间",
      convertToDate: "转换为日期",
      convertToTimestamp: "转换为时间戳",
      otherTimezones: "其他时区",
      sameTimestamp: "不同时区的相同时间戳",
      invalidTimestamp: "无效的时间戳格式",
      invalidDate: "无效的日期格式",
    },
    json: {
      title: "JSON 格式化器和验证器",
      description: "格式化、验证和处理带语法高亮的 JSON 数据",
      indentSize: "缩进大小：",
      insertSample: "插入示例",
      validJson: "有效的 JSON",
      invalidJson: "无效的 JSON",
      inputJson: "输入 JSON",
      inputDescription: "在此粘贴您的 JSON 数据以进行格式化和验证",
      formattedOutput: "格式化输出",
      outputDescription: "格式化和验证的 JSON 结果",
      minify: "压缩",
      copyFormatted: "复制格式化的 JSON",
    },
    yaml: {
      title: "YAML 验证器和格式化器",
      description: "验证、格式化 YAML 数据并与 JSON 相互转换",
      insertSample: "插入示例",
      validYaml: "有效的 YAML",
      invalidYaml: "无效的 YAML",
      inputDescription: "在此粘贴您的 YAML 或 JSON 数据",
      outputDescription: "格式化的 YAML、JSON 结果或验证状态",
      yamlToJson: "YAML → JSON",
      jsonToYaml: "JSON → YAML",
      clearAll: "全部清除",
    },
    url: {
      title: "URL 组件编码/解码器",
      description: "编码或解码 URL 组件以在 URL 中安全传输",
      enterText: "输入要进行 URL 编码的文本",
      enterEncoded: "输入要解码的 URL 编码字符串",
      urlEncoded: "URL 编码结果",
      decodedText: "解码文本结果",
    },
    base64Hex: {
      title: "Base64 ↔ 十六进制转换器",
      description: "在 Base64 和十六进制表示之间转换",
      base64ToHex: "Base64 → 十六进制",
      hexToBase64: "十六进制 → Base64",
      enterBase64: "输入 Base64 字符串",
      enterHex: "输入十六进制字符串",
      hexResult: "十六进制结果",
      base64Result: "Base64 结果",
    },
    messages: {
      historyCleared: "历史已清除",
      historyClearedDesc: "所有保存的数据已被清除",
      copiedToClipboard: "输出已复制到剪贴板",
      failedToCopy: "复制到剪贴板失败",
      outputCopied: "输出已复制到剪贴板",
      timestampCopied: "时间戳已复制到剪贴板",
      datetimeCopied: "日期时间已复制到剪贴板",
      formattedJsonCopied: "格式化的 JSON 已复制到剪贴板",
    },
  },
  fr: {
    common: {
      copy: "Copier",
      clear: "Effacer",
      clearHistory: "Effacer l'historique",
      input: "Entrée",
      output: "Sortie",
      encode: "Encoder",
      decode: "Décoder",
      convert: "Convertir",
      format: "Formater",
      validate: "Valider",
      sample: "Exemple",
      use: "Utiliser",
      search: "Rechercher",
      loading: "Chargement",
      error: "Erreur",
      success: "Succès",
      copied: "Copié !",
      invalid: "Invalide",
      valid: "Valide",
    },
    sidebar: {
      title: "Outils de Développement",
      base64: {
        name: "Encodeur/Décodeur Base64",
        description: "Encoder et décoder les chaînes Base64",
      },
      url: {
        name: "Encodeur/Décodeur URL",
        description: "Encoder et décoder les composants URL",
      },
      timestamp: {
        name: "Horodatage Unix",
        description: "Convertir les horodatages Unix",
      },
      base64Hex: {
        name: "Base64 vers Hex",
        description: "Convertir entre Base64 et Hex",
      },
      json: {
        name: "Formateur JSON",
        description: "Formater et manipuler JSON",
      },
      yaml: {
        name: "Validateur YAML",
        description: "Valider et formater YAML",
      },
    },
    base64: {
      title: "Encodeur/Décodeur Base64",
      description: "Encoder du texte ou des données binaires en Base64, ou décoder les chaînes Base64 en texte/binaire",
      inputHex: "L'entrée est une chaîne hexadécimale",
      hexSample: "Insérer un exemple hexadécimal",
      binarySample: "Insérer un exemple binaire",
      inputPlaceholder: "Le résultat apparaîtra ici...",
      outputPlaceholder: "Le résultat apparaîtra ici...",
      encodedResult: "Résultat encodé Base64",
      decodedResult: "Résultat texte décodé",
      binaryDetected: "Données binaires (dump hex avec ASCII)",
      binaryDescription:
        "Données binaires détectées : Affichage du dump hex avec décalages et représentation ASCII. Les caractères non imprimables sont affichés comme des points (.).",
      invalidBase64: "Chaîne Base64 invalide. Veuillez vérifier votre entrée.",
      invalidHex: "Chaîne hexadécimale invalide",
      failedEncode: "Échec de l'encodage",
    },
    timestamp: {
      title: "Convertisseur d'Horodatage Unix",
      description: "Convertir entre les horodatages Unix et les dates lisibles avec support des fuseaux horaires",
      timezoneSettings: "Paramètres de fuseau horaire",
      selectTimezone: "Sélectionner le fuseau horaire",
      currentOffset: "Décalage actuel",
      currentTime: "Heure actuelle",
      currentTimestamp: "Horodatage Unix actuel",
      currentDateTime: "Date et heure actuelles",
      enterTimestamp: "Entrer l'horodatage Unix (secondes depuis l'époque)",
      enterDateTime: "Entrer la date et l'heure dans le fuseau horaire sélectionné",
      convertToDate: "Convertir en date",
      convertToTimestamp: "Convertir en horodatage",
      otherTimezones: "Autres fuseaux horaires",
      sameTimestamp: "Même horodatage dans différents fuseaux horaires",
      invalidTimestamp: "Format d'horodatage invalide",
      invalidDate: "Format de date invalide",
    },
    json: {
      title: "Formateur et Validateur JSON",
      description: "Formater, valider et manipuler les données JSON avec coloration syntaxique",
      indentSize: "Taille d'indentation :",
      insertSample: "Insérer un exemple",
      validJson: "JSON valide",
      invalidJson: "JSON invalide",
      inputJson: "JSON d'entrée",
      inputDescription: "Collez vos données JSON ici pour les formater et les valider",
      formattedOutput: "Sortie formatée",
      outputDescription: "Résultat JSON formaté et validé",
      minify: "Minifier",
      copyFormatted: "Copier le JSON formaté",
    },
    yaml: {
      title: "Validateur et Formateur YAML",
      description: "Valider, formater les données YAML et convertir vers/depuis JSON",
      insertSample: "Insérer un exemple",
      validYaml: "YAML valide",
      invalidYaml: "YAML invalide",
      inputDescription: "Collez vos données YAML ou JSON ici",
      outputDescription: "YAML formaté, résultat JSON ou statut de validation",
      yamlToJson: "YAML → JSON",
      jsonToYaml: "JSON → YAML",
      clearAll: "Tout effacer",
    },
    url: {
      title: "Encodeur/Décodeur de Composants URL",
      description: "Encoder ou décoder les composants URL pour une transmission sûre dans les URLs",
      enterText: "Entrer le texte à encoder en URL",
      enterEncoded: "Entrer la chaîne encodée URL à décoder",
      urlEncoded: "Résultat encodé URL",
      decodedText: "Résultat texte décodé",
    },
    base64Hex: {
      title: "Convertisseur Base64 ↔ Hex",
      description: "Convertir entre les représentations Base64 et hexadécimales",
      base64ToHex: "Base64 → Hex",
      hexToBase64: "Hex → Base64",
      enterBase64: "Entrer la chaîne Base64",
      enterHex: "Entrer la chaîne hexadécimale",
      hexResult: "Résultat hexadécimal",
      base64Result: "Résultat Base64",
    },
    messages: {
      historyCleared: "Historique effacé",
      historyClearedDesc: "Toutes les données sauvegardées ont été effacées",
      copiedToClipboard: "Sortie copiée dans le presse-papiers",
      failedToCopy: "Échec de la copie dans le presse-papiers",
      outputCopied: "Sortie copiée dans le presse-papiers",
      timestampCopied: "Horodatage copié dans le presse-papiers",
      datetimeCopied: "Date-heure copiée dans le presse-papiers",
      formattedJsonCopied: "JSON formaté copié dans le presse-papiers",
    },
  },
}

export interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function useTranslation() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  return context
}

export { translations }
