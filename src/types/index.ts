export type Name = { name: string }
export type Age = { age: number }
export type Value = { value: string }
export type Union = Name | Age | Value

export type UnionKey<P> = P extends infer T ? keyof T : never

export type T = UnionKey<Union> // 'name' | 'age'

let unknownString = 'cegz'
type SL = typeof unknownString // string

const unknownString1 = 'cegz'
type SC = typeof unknownString1 // 'cegz'
// 等同于：
let unknownString2 = 'cegz' as const

// const Fn = (value: string) => value;
// type F = typeof Fn;

// // 得到：
// type F = (value: string) => string;

// const Placements = ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight'];

// type Placement = typeof Placements[number]; // 关键 [number]
// // 等价于
// type Placement = "topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight"

interface Point {
    x: number
    y: number
}

type P = keyof Point // 'x' | 'y'

function getProperty<T extends object, K extends keyof T>(obj: T, key: K) {
    return obj[key]
}

const user = {
    id: '1',
    name: 'xiaoming',
}

const userId = getProperty(user, 'id') // 1
const userName = getProperty(user, 'name') // xiaoming
// error. Argument of type '"age"' is not assignable to parameter of type '"id" | "name"'.
// const userAge = getProperty(user, 'age')

const propertys = Object.keys(user).map((key) => user[key as keyof typeof user])
console.log(propertys) // [ '1', 'xiaoming' ]

// enum EStatus {
//     success,
//     warning,
//     error,
// }
// type TStatusKey = keyof typeof EStatus

// // 得到：
// type TStatusKey = 'success' | 'warning' | 'error'

const changeDesc = (data: { desc: string } | { guide_desc: string }) => {
    // (data as { desc: string }).desc; // 一种是断言
    if ('desc' in data) {
        // 一种是使用 in 操作符
        data.desc
    } else {
        data.guide_desc
    }
}

interface Info {
    title: string
    desc?: {
        'zh-cn': string
        en: string
    }
}

const info: Info = {
    title: '信息',
}

let myName: string | undefined = undefined
myName ?? 'cegz'

type CssPadding =
    | 'padding-left'
    | 'padding-right'
    | 'padding-top'
    | 'padding-bottom'

type CssMargin = 'margin-left' | 'margin-right' | 'margin-top' | 'margin-bottom'

//   type Direction = "left" | "right" | "top" | "bottom";
//   type CssPadding = `padding-${Direction}`;
//   type CssMargin = `margin-${Direction}`;

interface IUser {
    name: string
    avatar: string
    contacts: {
        name: string
        age: number
    }
}
type PartialUser = Partial<IUser>

//   type PartialUser = {
//     name?: string | undefined;
//     avatar?: string | undefined;
//     contacts?: {
//         name: string;
//         age: number;
//     } | undefined;
//   }

interface PageInfo {
    title: string
}

type Page = 'home' | 'about' | 'contact'

const x: Record<Page, PageInfo> = {
    about: { title: 'about' },
    contact: { title: 'contact' },
    home: { title: 'home' },
}

// @types/global.d.ts

// 在 .d.ts 配置文件中编写 global 属性时，要先进行 export
export {}

declare global {
    // 全局变量声明
    function i18n(text: string): string

    interface Window {
        language: string
    }

    namespace NodeJS {
        export interface ProcessEnv {
            [key: string]: string
        }
    }
}

// declare module '*.module.css' {
//     const classes: { readonly [key: string]: string }
//     export default classes
// }
// declare module '*.module.scss' {
//     const classes: { readonly [key: string]: string }
//     export default classes
// }

// declare module '*.svg'
// declare module '*.png'
// declare module '*.jpg'
// declare module '*.jpeg'
// declare module '*.gif'
// declare module '*.bmp'
