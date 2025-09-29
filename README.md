# Malwa CRM (V16 - The Complete Workflow Build)

This is the definitive, polished, and fully functional frontend for Malwa CRM. This version implements the critical **JobSheet workflow**, auto-multipliers for estimates, direct ledger posting, and a dynamic approval system, all wrapped in the strict Malwa CRM design system.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1.  **Navigate to the project directory:**
    ```sh
    cd malwa-crm
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```

### Running the Development Server
1.  **Start the Vite server:**
    ```sh
    npm run dev
    ```
2.  Open your browser and navigate to `http://localhost:5173`.

### Login Credentials
-   **User ID / Email:** `malwatrolley@gmail.com`
-   **PIN / Password:** `Malwa822`

### Key Features of this Version
-   **Complete Workflow:** Inspection -> Estimate -> **JobSheet** -> Approval -> Challan -> Invoice.
-   **Intelligent JobSheet:** Finalizing the JobSheet automatically posts real costs to vendor/labour ledgers and deducts stock from inventory.
-   **Auto-Multipliers:** Automatically calculates estimate prices from inspection costs to ensure margins.
-   **Dynamic Approval System:** Discounts over 5% trigger a request on the dashboard.
-   **Polished UI:** A responsive, collapsible sidebar and a consistent, professional theme.
