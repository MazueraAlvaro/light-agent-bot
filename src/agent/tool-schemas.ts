export const toolSchemas: any[] = [
    {
        type: 'function',
        function: {
            name: 'verifyPatient',
            description: 'Verifica identidad del paciente',
            parameters: {
                type: 'object',
                properties: {
                    documentId: { type: 'string' },
                    birthDate: { type: 'string', description: 'YYYY-MM-DD' },
                },
                required: ['documentId', 'birthDate'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'listAvailability',
            description: 'Lista citas disponibles',
            parameters: {
                type: 'object',
                properties: {
                    specialtyCode: {
                        type: 'string',
                        description:
                            'Código interno de la especialidad. Ej: MED123, ODNT234, PED567',
                    },
                },
                required: ['specialty'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'createAppointment',
            description: 'Crea una cita en un cupo dado',
            parameters: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    appointmentId: { type: 'string' },
                },
                required: ['userId', 'appointmentId'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'getAppointment',
            description: 'Consulta citas del paciente',
            parameters: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                },
                required: ['userId'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'cancelAppointment',
            description: 'Cancela una cita',
            parameters: {
                type: 'object',
                properties: {
                    userId: { type: 'string' },
                    appointmentId: { type: 'string' },
                },
                required: ['userId', 'appointmentId'],
            },
        },
    },
]
