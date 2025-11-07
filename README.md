````{"id":"23984","variant":"standard","title":"README - Light Agent Bot"}
# Light Agent Bot

Asistente de IA ligero orientado a **agendamiento de citas médicas** (solicitar, consultar y cancelar), con verificación de identidad y uso estricto de herramientas.  
Este proyecto demuestra cómo **orquestar un LLM (vLLM)** con reglas de negocio definidas, *system prompt* bien estructurado y control de flujo para evitar comportamientos no deseados.

> Repo: [https://github.com/MazueraAlvaro/light-agent-bot](https://github.com/MazueraAlvaro/light-agent-bot)

---

## 🚀 Características

- **Agente médico** con tres funciones principales: **asignar**, **consultar** y **cancelar** citas.  
- **Verificación de identidad** antes de cada acción.  
- **Uso de herramientas controladas** (`listAvailability`, `createAppointment`, `getAppointment`, `cancelAppointment`).  
- Cumplimiento del principio de **mínimo necesario (PHI)** y **no divulgación de datos internos**.  
- Integración con **vLLM** compatible con la API de OpenAI (`/v1/chat/completions`).  

---

## 🧱 Arquitectura General

```
[Cliente / Frontend]  →  [Light Agent Bot API]  →  [vLLM: Qwen3-4B-Instruct]
                                 │
                                 ├── verifyPatient / listAvailability / createAppointment / cancelAppointment
                                 └── Servicios / DB de negocio
```

- El **modelo LLM** se usa para el razonamiento y comprensión.  
- La **lógica de negocio** (verificación, validación, políticas) se mantiene en el backend.  

---

## 📦 Requisitos

- GPU NVIDIA con soporte CUDA.  
- Docker + nvidia-container-toolkit configurado.  
- Token de Hugging Face válido (`HUGGING_FACE_HUB_TOKEN`).  
- Node.js 18+ o entorno compatible.  

---

## ⚙️ Variables de entorno (.env)

Ejemplo de configuración mínima:

```bash
PORT=3000
NODE_ENV=development

# vLLM endpoint
VLLM_BASE_URL=http://localhost:8000/v1
VLLM_MODEL=Qwen/Qwen3-4B-Instruct-2507

# APIs de negocio
APPOINTMENTS_API_URL=http://localhost:4000
APPOINTMENTS_API_KEY=change-me
```

---

## 🏃‍♂️ Ejecución rápida

### 1. Clonar e instalar

```bash
git clone https://github.com/MazueraAlvaro/light-agent-bot.git
cd light-agent-bot
npm install
```

---

### 2. Ejecutar **vLLM con Docker**

> Asegúrate de tener instalado `nvidia-container-toolkit`.  
> Sustituye `hf_<TOKEN>` por tu token de Hugging Face.

```bash
docker run --cpus="2" --runtime nvidia --gpus all \
  --name vllm_container_qwen_opt \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  --env "HUGGING_FACE_HUB_TOKEN=hf_<TOKEN>" \
  -p 8000:8000 \
  --shm-size=2g \
  --ipc=host \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen3-4B-Instruct-2507 \
  --enable-auto-tool-choice \
  --tool-call-parser hermes \
  --max_model_len 43472 \
  --max-num-seqs 384
```

🔹 **Sugerencias:**
- Ajusta `--max-num-seqs` si tu GPU tiene menos VRAM.  
- Usa `--max_model_len` según el tamaño máximo de contexto esperado.  
- Verifica el uso de cache en los logs (`GPU KV cache usage`).  

---

### 3. Probar el endpoint del modelo

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-4B-Instruct-2507",
    "messages": [{"role": "user", "content": "What is the capital of France?"}]
  }'
```

Deberías recibir una respuesta que contenga `"Paris"`.

---

### 4. Iniciar la aplicación del agente

```bash
npm run start:dev
# o para producción
npm run build && npm run start:prod
```

---

## 🧠 Comportamiento del agente

- Verifica identidad antes de cualquier acción.  
- Solo ofrece citas **existentes** mediante `listAvailability`.  
- Utiliza **selecciones numeradas** en lugar de IDs visibles.  
- No genera información médica ni respuestas fuera de su dominio.  
- Mantiene **alta precisión y control de contexto** a través del prompt del sistema.  

---

## 🔬 Pruebas de carga (k6)

Ejemplo de prueba:

```js
import http from 'k6/http';
import { check } from 'k6';

export const options = { vus: 50, duration: '30s' };

export default function () {
  const res = http.post('http://localhost:8000/v1/chat/completions', JSON.stringify({
    model: 'Qwen/Qwen3-4B-Instruct-2507',
    messages: [{ role: 'user', content: 'What is the capital of France?' }],
  }), { headers: { 'Content-Type': 'application/json' } });

  check(res, {
    'status 200': r => r.status === 200,
    'mentions Paris': r => (r.json()?.choices?.[0]?.message?.content || '').toLowerCase().includes('paris')
  });
}
```

---

## 🧩 Problemas comunes

| Problema | Solución |
|-----------|-----------|
| **OOM al arrancar vLLM** | Reduce `--max-num-seqs` o `--max_model_len`. |
| **Latencia alta (p95)** | Ajusta `max_tokens` en requests o reduce `--max-num-seqs`. |
| **Respuestas inventadas** | Revisa el *system prompt* y las reglas de uso de herramientas. |

---

## 📜 Licencia

MIT

---

## 🤝 Contribuciones

1. Crea un *issue* con la descripción del cambio.  
2. Haz un fork y una rama con tu mejora.  
3. Abre un *Pull Request* con detalle de pruebas y comportamiento esperado.  

---
````
