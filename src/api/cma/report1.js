import request from "@/network"
import moment from "moment"
let { post: $post } = request
// 获取数据
export let GetReport1Search = (type, ser, times) =>
  // moment().format("YYYY-MM-DD HH:mm:ss")
  $post(`api/FPDCSFR/SearchAAMC?DefectType=${type}&DeviceSeriers=${ser}&datetime=${times}`)
//获取DefectType下拉框数据
export let GetDefectTypeInfo = () => $post(`/api/FPDCSFR/Load_DefectType`)

//获取DeviceSeriers下拉框数据
export let GetDeviceSeriersInfo = () => $post(`/api/FPDCSFR/Load_DeviceSeriers`)
