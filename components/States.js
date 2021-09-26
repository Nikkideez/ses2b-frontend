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

export { sidebarOpenState, currentUserState, isStudentState }