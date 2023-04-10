# ftc-documents

## Finacial Statement

The Family Court of Australia requires a financial statement to be filed with the court. This is a form that is filled out by the parties and their lawyers. The form is then converted to a PDF and filed with the court.

### Page 1
* Client ID:
* File number
* Full name: [140, 220]

### Part A About you
* Family name: [96, 352]
* Given name: [334, 352]

## Example

To run the code as dev

```bash
yarn install && yarn dev
```

POST `/finstatement`

```json
{
    "given_name": "John",
    "family_name": "Smith",
    "client_id": "123",
    "address": "123 Example Road",
    "state": "QLD",
    "postcode": "4000",
    "password": "P@ssword!"
}
```

Thanks for the libraries 
* pdf
* muhammara https://github.com/julianhille/MuhammaraJS