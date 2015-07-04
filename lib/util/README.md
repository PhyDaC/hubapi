## Master Reporting Util

This tool provides a means of generating "master" reports. Master reports contain data for the entire network. 
The level of granularity is either provider or clinic (for the entire network). 
As such, these reports contain information that would violate the security policies if made avaliable to via the 
visaulizer to all users of the PDC network. 

These reports are to be generated at the request of a PDC administrator of designated manager. 
They must be generated by a system administrator or engineer who has access to the internal network of the system. 

Reports should be encrypted after generation before they are sent to the designated recipent. 


Currently, the utility supports the following three reports/queries: 

* PDC-001 Demographics Report (by clinic and network)
* PDC-1740 Encounters Report (broken down by clinic and network)
* PDC-1738 Attached Active Patients Report (broken down by clinic and network).

To run the utility use the following command (in the this `util/` directory). 
 
    QUERY=PDC-XXX EXECUTION_DATE=7 node generateReports.js
    
* `QUERY=PDC-XXX` is the name of one of the supported query types.
* `EXECUTION_DATE=7` is the date of the month that we are using to space the execution. `7` will take execution results from the 7th of each month if they exist. 

The generated report will be placed in `util/report.csv`

For example, to generate the report for the demographics query which was run on the 7th of each month: 

    QUERY=PDC-001 EXECUTION_DATE=7 node generateReport.js