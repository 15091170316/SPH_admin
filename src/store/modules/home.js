import mockRequest from '@/utils/mockRequest'

const state = {
  chartsList: {}
}
const actions = {
  async getMockData(context) {
    const request = await mockRequest({method: 'get', url: 'home/list'})
    if (request.code === 20000) {
      context.commit('GETMOCKDATA', request.data)
    }
  }
}
const mutations = {
    GETMOCKDATA(state, value){
        state.chartsList = value
    }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
