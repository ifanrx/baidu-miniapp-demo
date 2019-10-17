/**
 * @see https://smartprogram.baidu.com/docs/develop/api/show_toast/ - 交互 API 文档
 */
export const showToast = swan.showToast
export const hideToast = swan.hideToast
export const showModal = swan.showModal
export const showLoading = swan.showLoading
export const hideLoading = swan.hideLoading
export const showActionSheet = swan.showActionSheet

export function showModalText(text) {
  showModal({
      content: text,
  })
}

export function showSuccessToast(text = '成功') {
  showToast({
      title: text,
      icon: 'success',
      duration: 1000,
  })
}

export function showFailToast(text = '失败') {
  showToast({
      title: text,
      icon: 'none',
      duration: 1000,
  })
}

export function showLoadingText(title = '加载中...') {
  showLoading({
      title
  })
}

export function hideLoadingText() {
  hideLoading()
}
