module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "airbnb",
    "parserOptions": {
        "sourceType": "module"
    },
    "globals": {
        "window": true
    },
    "rules": {
        "react/jsx-no-bind": [2, {}],
        "import/no-extraneous-dependencies": "off",
        "no-throw-literal": "off",
        "no-undef": "off",
        "no-control-regex": "off",
        "max-len": "off",
        "class-methods-use-this": "off",
        "no-use-before-define": "off",
        "quote-props": "off",
        "func-names": "off",
        "no-underscore-dangle": "off",
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};