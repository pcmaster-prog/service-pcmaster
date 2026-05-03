provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "main" {
  name = "service-pcmaster-cluster"
}

# Add ECS service definitions, load balancers, etc.
