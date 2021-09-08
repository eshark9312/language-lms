type IStudentExamServices = IBaseApi<{
  ID: number;
  UserInformationID: number;
  FullNameUnicode: string;
  SupplierServicesID: number;
  SupplierServicesName: string;
  ServiceID: number;
  ServiceName: string;
  ExamOfServiceID: number;
  ExamOfServiceStyle: number;
  ExamOfServiceStyleName: string;
  Price: number;
  DiscountCode: string;
  Reduced: number;
  Paid: number;
  PaymentMethodsID: number;
  PaymentMethodsName: string;
  PayBranchID: number;
  PayBranchName: string;
  DonePaid: boolean;
}>;
