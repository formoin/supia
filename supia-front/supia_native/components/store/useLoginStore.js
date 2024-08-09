import {createStore} from 'zustand';
import {persist} from 'zustand/middleware';

const useLoginStore = createStore(
  persist(
    set => ({
      isLoggedIn: false,
      login: () => set({isLoggedIn: true}),
      logout: () => set({isLoggedIn: false}),
      token:

        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJydGNUZXN0M0BuYXZlci5jb20iLCJtZW1iZXJJZCI6NSwiaWF0IjoxNzIzMTgwOTUzLCJleHAiOjE3NTQ3MTY5NTN9.FDQOfI26lKaPrcfU_EtxWMjZVgalA3-U0t5lSVYIcTxxeDpM-rF6-qhG5XOHnwj4W5gCRLPLkbsc1-nLeplKQA',

    }),

    {
      name: 'login state',
    },
  ),
);

export default useLoginStore;
