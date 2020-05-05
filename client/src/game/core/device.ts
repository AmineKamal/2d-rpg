const re = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;

export function isMobile() {
  return re.test(navigator.userAgent);
}
