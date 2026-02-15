# Document Intelligence API Gateway - Specification

## Project Overview
- **Project Name**: DocuExtract Gateway
- **Type**: Node.js/Express API Gateway
- **Core Functionality**: Unified API that abstracts multiple document extraction services (LangExtract, AWS Textract, Azure Document Intelligence) with intelligent routing and volume discounts
- **Target Users**: Developers and enterprises needing document extraction with cost optimization

## Architecture

### Core Components
1. **API Gateway** - Express.js REST API exposing document extraction endpoints
2. **Provider Adapters** - Abstract interfaces for each extraction service
3. **Routing Engine** - Intelligent provider selection based on document type, cost, and speed
4. **Pricing Engine** - Volume discount calculations

### Supported Providers
1. **LangExtract** - Custom/local extraction service (cheapest for text-heavy docs)
2. **AWS Textract** - Amazon's document extraction (fast for PDFs/images)
3. **Azure Document Intelligence** - Microsoft's AI service (best for forms/layouts)

## Functionality Specification

### 1. Unified API Endpoints
- `POST /extract` - Extract text/structure from document
- `GET /providers` - List available providers
- `GET /pricing` - Get pricing tiers and discounts
- `GET /health` - Health check endpoint

### 2. Auto-Routing Logic
| Document Type | Primary Provider | Fallback |
|--------------|-------------------|----------|
| invoice | Azure | AWS Textract |
| receipt | AWS Textract | Azure |
| form | Azure | AWS Textract |
| contract | LangExtract | Azure |
| id_document | AWS Textract | Azure |
| generic | AWS Textract | LangExtract |

### 3. Routing Criteria
- **Cost Optimization**: Cheapest provider for document type
- **Speed**: Provider response time consideration
- **Accuracy**: Quality score per document type
- **Fallback**: Automatic retry on failure

### 4. Volume Discounts
| Monthly Volume | Discount |
|---------------|----------|
| 0-1,000 pages | 0% |
| 1,001-10,000 pages | 10% |
| 10,001-50,000 pages | 20% |
| 50,001-100,000 pages | 30% |
| 100,000+ pages | 40% |

### 5. Provider Pricing (per page)
- LangExtract: $0.001/page
- AWS Textract: $0.015/page (AnalyzeDocument)
- Azure Document Intelligence: $0.005/page (prebuilt-document)

## Data Flow
1. Client sends document to `/extract` endpoint
2. Gateway analyzes document type (via metadata or ML)
3. Routing engine selects optimal provider
4. Document sent to selected provider
5. Response normalized and returned to client
6. Usage tracked for billing

## Configuration
All configuration via `config.yaml`:
- Provider credentials
- Pricing tiers
- Routing rules
- Fallback settings

## Acceptance Criteria
1. Gateway accepts document uploads and returns extracted content
2. Auto-routing selects appropriate provider based on document type
3. Volume discounts applied correctly based on usage
4. Fallback mechanism works when primary provider fails
5. All endpoints return proper JSON responses
6. Health check returns provider status
