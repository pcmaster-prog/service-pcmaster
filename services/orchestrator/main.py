from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import httpx
import os

app = FastAPI(title="Service PC Master Orchestrator")

class TaskRequest(BaseModel):
    task_type: str
    description: str
    metadata: dict = {}

@app.get("/")
async def root():
    return {"status": "Service PC Master Orchestrator is Running"}

@app.post("/delegate")
async def delegate_task(request: TaskRequest, background_tasks: BackgroundTasks):
    """
    Orchestrates tasks by assigning them to the appropriate service or agent.
    """
    # logic to route based on task_type
    if request.task_type == "WORK_ORDER":
        # Call Order Service
        background_tasks.add_task(call_service, "order-service", "/orders", request.description)
    elif request.task_type == "PAYMENT":
        # Call Payment Service
        background_tasks.add_task(call_service, "payment-service", "/process", request.description)
    
    return {"message": "Task received and delegation in progress", "task_id": "123"}

async def call_service(service_name: str, endpoint: str, data: str):
    async with httpx.AsyncClient() as client:
        try:
            # In a real microservices env, service_name would resolve via DNS (Docker)
            await client.post(f"http://{service_name}:8080{endpoint}", json={"data": data})
        except Exception as e:
            print(f"Error calling {service_name}: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
