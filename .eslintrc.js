module.exports = {
  root: false,
  env: {
    node: true,
    es6: true,
    browser: true
  },
  extends: [
    "plugin:vue/essential",
    // "eslint:recommended"
  ],
  // https://eslint.org/docs/rules/
  rules: {
    // 禁止空模块
    "no-empty": "error",
    // 禁止var
    "no-var": "error",
    // 禁止使用alert
    "no-alert": "warn",
    // 生产环境下不允许使用console输出
    "no-console": process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 生产环境不允许使用debugger
    "no-debugger": process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 强制文末不带逗号，IE下不支持带逗号
    "comma-dangle": [
      "error",
      "never"
    ],
    // 强制换行双空格，默认是4
    // webstrom在Editor->Code Style->html的Do not indent children of里添加script
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    // 强制定义字符串使用单引号
    "quotes": ["error", "single"]
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
}
