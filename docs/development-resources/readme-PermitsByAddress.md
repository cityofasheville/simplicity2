## Overview of how we will add permit search by address to /permits/search

An address text box like the one on the home page will send the address to:

    query searchQuery($searchString: String!, $searchContexts: [String]) {
        search(searchString: $searchString, searchContexts: $searchContexts) {
            results {
                ... on AddressResult {
                    civic_address_id
                    address
                    zipcode
                }
            }
        }
    }
with GraphQL variables:

    {"searchString": "161 S Charlotte St", "searchContexts": ["address"]}

This uses the geocoder to return potential matches:

    {
        "data": {
            "search": [
                {
                    "results": [
                        {
                            "civic_address_id": "17184",
                            "address": "161 S CHARLOTTE ST                      ",
                            "zipcode": "28801"
                        },
                        {
                            "civic_address_id": "293422",
                            "address": "161 CHARLOTTE HWY                       ",
                            "zipcode": "28803"
                        },
                        {
                            "civic_address_id": "263394",
                            "address": "1611 CHARLOTTE HWY                      ",
                            "zipcode": "28730"
                        }
                    ]
                }
            ]
        }
    }

The user selects one and the civic_address_id is passed back to:

    query get_permits_by_address ($civicaddress_id: Int!) {
        permits_by_address_realtime(civicaddress_id: $civicaddress_id) {
            permit_number
            applied_date
            permit_description
        }
    }
with GraphQL variable (notice that it changes to an Int here):

    {"civicaddress_id": 17184}

This returns the list of permits for that address:

    {
        "data": {
            "permits_by_address": [
                {
                    "applied_date": "1999-12-17T00:00:00.000Z",
                    "applicant_name": "DAN STEWART INTERNAL USE",
                    "permit_type": "Commercial",
                    "permit_subtype": "New",
                    "permit_category": "Other",
                    "permit_group": "Permits",
                    "permit_number": "99-06291"
                },
                {
                    "applied_date": "2021-09-27T00:00:00.000Z",
                    "applicant_name": null,
                    "permit_type": "Commercial",
                    "permit_subtype": "Trade",
                    "permit_category": "Electrical",
                    "permit_group": "Permits",
                    "permit_number": "21TMP-003855"
                },
    ...

User selects one and permit_number is used to show page /permits/99-06291