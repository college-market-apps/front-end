import API,{copyObject} from '../../helpers/api'

const GET_SERVICES_BY_SCHOOL = 'GET_SERVICES_BY_SCHOOL'
const GOT_A_SERVICE = 'GOT_A_SERVICE'
const gotServiceBySchool = (services)=>{
    return {
        type:GET_SERVICES_BY_SCHOOL,
        services
    }
}

const gotAService = (service)=>{
    return {
        type:GOT_A_SERVICE,
        service
    }
}

export const getSchoolServices = (serviceId)=>{
    return async (dispatch)=>{
        const {data} = await API({method:'get', url:`/api/services/byschool`})
        dispatch(gotServiceBySchool(data?.services || []))
    }
}

export const getAService = (serviceId) => {
    return async (dispatch)=>{
        const {data} = await API({method: 'get', url:`/api/service/${serviceId}`})
        dispatch(gotAService(data.service))
    }
}

export default function Service(services=[], action){
    switch (action.type) {
        case GET_SERVICES_BY_SCHOOL:{
            const schoolServicesCopyState = copyObject(services)
            return [...schoolServicesCopyState, ...action.services]
        }
        case GOT_A_SERVICE:{
            return [services, action.service]
        }
        default:
            return services
    }
}
