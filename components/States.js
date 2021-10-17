import {theme, themeTwo} from '../src/theme';
const { atom, selector } = require("recoil");

const sidebarOpenState =atom ({
    key: 'sidebarOpenState',
    default: false
})
const currentUserState =atom ({
    key: 'currentUserState',
    default: null
})

const isStudentState =atom({
    key: 'isStudentState',
    default: true
})

const themeState = atom({
    key: 'themeState',
    default: theme
})

export { sidebarOpenState, currentUserState, isStudentState, themeState}