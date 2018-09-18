Option Explicit

On Error Resume Next

ExcelMacroExample

Sub ExcelMacroExample() 

  Dim xlApp 
  Dim xlBook 

  Set xlApp = CreateObject("Excel.Application") 
  Set xlBook = xlApp.Workbooks.Open("D:\dev\aed-challenge\http\Responder", 0, True) 
  xlApp.Run "export"
  xlBook.Close False 
  xlApp.Quit 

  Set xlBook = Nothing 
  Set xlApp = Nothing 

End Sub
