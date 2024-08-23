import type { FormInstance} from 'element-plus'


const checkForm = async (form: FormInstance | undefined, callback: Function) => {
	await form!.validate(async (valid, fields) => {
		if (valid) {
			callback && callback()
		} else {
			window.scrollTo(0, 0)
		}
	})
}



export default checkForm