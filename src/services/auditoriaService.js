import API from '../api'; // Tu archivo axios.create

export const getDatosInicio = async () => {
    try {
        const [resAreas, resAuditores] = await Promise.all([
            API.get('/areas'),
            API.get('/auditores')
        ]);
        return {
            areas: resAreas.data,
            auditores: resAuditores.data
        };
    } catch (error) {
        console.error("Error cargando catálogos", error);
        throw error;
    }
};

export const iniciarAuditoriaEnBD = async (datos) => {
    try {
        const res = await API.post('/iniciar', datos);
        return res.data; // Retorna el id_auditoria creado
    } catch (error) {
        console.error("Error al iniciar auditoría", error);
        throw error;
    }
};