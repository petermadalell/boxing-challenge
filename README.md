# Installation Boxing Challenge
To get started with this project, follow these steps:

Clone the repository:
```bash
git clone <repository-url>
```

Navigate to the project directory:
```bash
cd <project-directory>
```

Install dependencies:
```bash
npm install
```

Usage
To run the project, use the following command:
```bash
npm run dev
```

To run tests, use the following command:
```bash
npm test
```

## Here is an example input:

Products:
1. User selects a product from the Autocomplete input.
2. Clicks Add Product and the selected product will be added to the list.
3. Clicks Allocate into Boxes and Selected boxes from algorithm will be displayed.

## Known Limitations and Edge Cases
1. Single Dimension Constraint: The algorithm ensures that no single dimension of any product exceeds the corresponding dimension of its assigned box. 

2. Large Products: If a product is too large to fit in any box, the algorithm allocates it to its own box. If it doesn't fit in the largest available box, an error message is returned.

3. Volume Calculation: The algorithm assumes that the volume of the products and boxes is calculated as width x height x length.

4. User cannot add more than one for the same product per transaction.

5. Can only add up to 10 products per transaction.
