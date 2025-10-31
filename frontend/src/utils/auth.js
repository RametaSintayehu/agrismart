export function saveToken(token) {
    localStorage.setItem('agrismart_token', token);
}
export function getToken() {
    return localStorage.getItem('agrismart_token',token);
}
export function logout(){
    localStorage.removeItem('agrismart_token');
}
