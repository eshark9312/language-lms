type ICourseOfStudentPrice = IBaseApi<{
  Course: {
    ID: number;
    CourseName: string;
  }[];
  UserInformationID: number;
  FullNameUnicode: string;
  PayBranchID: number;
  PayBranchName: string;
  Price: number;
  DiscountCode: string;
  Reduced: number;
  Paid: number;
  MoneyInDebt: number;
  PaymentMethodsID: number;
  PaymentMethodsName: string;
  DonePaid: boolean;
  PayDate: string;
  isRefunds: boolean;
  RefundsID: number;
}>;