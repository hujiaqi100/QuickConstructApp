import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import postcss from "rollup-plugin-postcss";
export default {
    input: 'src/index.ts',
    output: [
        {
            format: 'cjs',
            dir: `./dist/cjs`,
        },
        {
            format: 'esm',
            dir: `./dist/esm`,
        },
        {
            format: 'umd',
            name: 'h_qca',
            dir: `./dist/umd`,
        }
    ],
    plugins: [
        resolve(),
        commonjs(),
        postcss({
            minimize: true,
            extract: true,
            modules: true,
            use: {
                less: true,
            },
        }),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            presets: [
                ["@babel/preset-env", { targets: "> 0.25%, not dead" }],
                "@babel/preset-react"
            ],
        }),
        typescript({ tsconfig: './tsconfig.json' })
    ],
    external: ['react', 'react-dom', 'lodash', 'antd', '@ant-design/icons']
};
