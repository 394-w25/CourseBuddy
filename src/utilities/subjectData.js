export const SUBJECTS = [
    "ACCOUNT", "ACCT", "ACCTX", "ADVT", "AFST", "AMER_ST", "ANTHRO", "APP_PHYS", "ARABIC",
    "ART", "ART_HIST", "ASIAN_AM", "ASIAN_LC", "ASTRON", "BIOL_SCI", "BIOSTAT", "BLAW",
    "BLK_ST", "BMD_ENG", "BUS_ANLY", "BUS_INST", "BUSCOM", "CFS", "CHEM", "CHEM_ENG", 
    "CHINESE", "CHSS", "CIC", "CIS", "CIV_ENV", "CLASSICS", "CLIN_PSY", "CME", "CMN",
    "COG_SCI", "COMM_ST", "COMP_ENG", "COMP_LIT", "COMP_SCI", "CONDUCT", "CONPUB", "COUN",
    "CRDV", "CRIM", "CRT_TRES", "CSD", "DANCE", "DATA_ENG", "DECS", "DGP", "DSGN", "EARTH",
    "ECON", "ELEC_ENG", "EMDC", "ENGLISH", "ENTR", "ENTREP", "ENTRM", "ENTRX", "ENVR_POL",
    "ENVR_SCI", "EPICS", "EPID", "ES_APPM", "EXMMX", "FINANCE", "FINC", "FINCM", "FINCX",
    "FN_EXTND", "FRENCH", "GAMS", "GBL_HLTH", "GEN_ENG", "GEN_LA", "GEN_MUS", "GENET_CN",
    "GERMAN", "GNDR_ST", "GREEK", "HCA", "HCAK", "HCAKX", "HC_COM", "HDC", "HDSP", "HEBREW",
    "HIND_URD", "HISTORY", "HLTH_PRF", "HLTH_SCI", "HSIP", "HSR", "HUM", "IBIS", "IEMS",
    "IMC", "INF_TECH", "INTG_SCI", "INTL", "INTLM", "INTL_ST", "INTLX", "ISEN", "ITALIAN",
    "JAPANESE", "JAZZ_ST", "JOUR", "JRN_WRIT", "JWSH_ST", "KELLG_FE", "KELLG_MA", "KOREAN",
    "KPHD", "LATIN", "LATIN_AM", "LATINO", "LAWSTUDY", "LDEV", "LDEVX", "LDRSHP", "LEAD_ART",
    "LEGAL_ST", "LING", "LIT", "LITARB", "LOC", "LRN_SCI", "MATH", "MAT_SCI", "MBAI",
    "MBIOTECH", "MCW", "MECH_ENG", "MECN", "MECNM", "MECNX", "MECS", "MED_SKIL", "MEM",
    "MENA", "MHB", "MHI", "MKTG", "MKTGX", "MLDS", "MMSS", "MORS", "MORSX", "MPD", "MPPA",
    "MSA", "MSAI", "MSC", "MSCI", "MSDS", "MSGH", "MSHA", "MSLCE", "MSRC", "MSTP", "MS_DSP",
    "MS_ED", "MS_FT", "MS_HE", "MS_IDS", "MS_LOC", "MTS", "MUSEUM", "MUSIC", "MUSIC_ED",
    "MUSICOL", "MUS_COMP", "MUS_TECH", "MUS_THRY", "NAIS", "NAV_SCI", "NEUROBIO", "NEUROSCI",
    "NHSI", "NUIN", "OPNS", "OPNSM", "ORG_BEH", "PACT", "PBC", "PERF_ST", "PHIL", "PHIL_NP",
    "PHYS_TH", "PHYSICS", "PIANO", "POLISH", "POLI_SCI", "PRDV", "PROF_DEV", "PRO_HLTH",
    "PROJ_MGT", "PROJ_PMI", "PSYCH", "PUB_HLTH", "QARS", "QSB", "REAL", "RELIGION", "REPR_SCI",
    "RTVF", "RUSSIAN", "SAI", "SCIMEDIA", "SE_POL", "SESP", "SHC", "SLAVIC", "SOC_POL",
    "SOCIOL", "SPANISH", "SPANPORT", "SPS", "SSIM", "SSIMX", "STAT", "STRINGS", "STRT",
    "STRTX", "SWAHILI", "TEACH_ED", "TGS", "TH&DRAMA", "THEATRE", "TRANS", "TURKISH", "VOICE",
    "WIND_PER"
  ];
  
  const pastelPalette = [
    "#D699B6", "#FFB6A9", "#FFA07A", "#FFC966", "#E3A855", "#B0D36E", "#90C695", "#5DA49D",
    "#6EA8D9", "#82B6F2", "#A3A5F2", "#B8A2D9", "#D8A6E3", "#E5B5C0", "#F9C9B1", "#F5BCA9",
    "#E6AA77", "#D8C66E", "#A8D56E", "#79C595", "#67A6A5", "#7993D6", "#8FA5F2", "#A6B6F2",
    "#C2A2D9", "#D9A6E3", "#E6B5C0", "#F2C9A9", "#E5AA77", "#D6B56E", "#A8C56E", "#79B595"
  ];
  
  
  export const SUBJECT_COLORS = {};
  
  SUBJECTS.forEach((subject, idx) => {
    SUBJECT_COLORS[subject] = pastelPalette[idx % pastelPalette.length];
  });
  