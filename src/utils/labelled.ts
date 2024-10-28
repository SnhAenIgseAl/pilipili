import { storeToRefs } from "pinia"
import { useSettingStore } from "../stores/setting"



const {
	USER_LABELLED_LIST
} = storeToRefs(useSettingStore())



const labelled = (data: Object[]) => {
	let list = new Array(USER_LABELLED_LIST.value.length).fill(0)
	
	for (let i = 0; i < data.length; i++) {
		let dt = JSON.stringify(data[i])
		
		for (let j = 0; j < USER_LABELLED_LIST.value.length; j++) {
			if (dt.includes(USER_LABELLED_LIST.value[j])) {
				list[j] ++
			}
		}
	}
	
	return list
}



export default labelled