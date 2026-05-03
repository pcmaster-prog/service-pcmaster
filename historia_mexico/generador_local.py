import torch
from diffusers import AutoPipelineForText2Image
import sys
import os
import json

def generate_local(prompts_list, output_folder):
    print("Iniciando Generador Local (MODO CPU por compatibilidad con RTX 5080)...")
    
    # Usar CPU porque sm_120 no está soportado aún en PyTorch estable
    pipeline = AutoPipelineForText2Image.from_pretrained(
        "stabilityai/sdxl-turbo", 
        torch_dtype=torch.float32 # CPU requiere float32
    ).to("cpu")

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for i, prompt in enumerate(prompts_list):
        filename = f"img_{str(i+1).zfill(2)}.jpg"
        filepath = os.path.join(output_folder, filename)
        
        if os.path.exists(filepath):
            continue

        print(f"Generando {i+1}/48 (CPU): {prompt[:50]}...")
        
        # SDXL Turbo en CPU
        image = pipeline(
            prompt=prompt, 
            num_inference_steps=1, 
            guidance_scale=0.0,
            width=512, # Reducimos tamaño para que sea más rápido en CPU
            height=512
        ).images[0]
        
        image.save(filepath)

if __name__ == "__main__":
    prompts_file = sys.argv[1]
    folder = sys.argv[2]
    with open(prompts_file, 'r', encoding='utf-8') as f:
        prompts = json.load(f)
    generate_local(prompts, folder)
