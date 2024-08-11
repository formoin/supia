import {createStore} from 'zustand';
import {persist} from 'zustand/middleware';

const useLoginStore = createStore(
  persist(
    set => ({
      isLoggedIn: false,
      login: () => set({isLoggedIn: true}),
      logout: () => set({isLoggedIn: false}),
      token:
"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMDE2QG5hdmVyLmNvbSIsIm1lbWJlcklkIjoxMCwiaWF0IjoxNzIzMzY4NDUzLCJleHAiOjE3NTQ5MDQ0NTN9.3y12CDK1Zg_xQirCmgvB_wJ52whnBAeJVzTYERW6BWlmN-x3a4vVp_Fhx4AZW38Q-lUj7knU2thSXEAAFHvnlg"

}),
    {
      name: 'login state',
    },
  ),
);

export default useLoginStore;