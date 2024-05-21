import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Portfolio/Position";
import FollowUps from "../pages/Utilitys";
import Drawer from "./Type/DrawerNavigation";

import BlockedScript from "../pages/BlockedScript";
import BrokerBill from "../pages/BrokerBill";
import ChangePassword from "../pages/ChangePassword";
import Login from "../pages/Login";
import RulesAndRegulationsPage from "../pages/RulesAndRegulationsPage";
import Splash from "../pages/Splash";
import SummaryReport from "../pages/SummaryReport";
import UplineBill from "../pages/UplineBill";

import AddAccount from "@pages/CreateUser/AddAccount";
import Admin from "@pages/CreateUser/Admin/Admin";
import Broker from "@pages/CreateUser/Broker/Broker";
import Master from "@pages/CreateUser/Master/Master";
import Users from "@pages/CreateUser/User/User";

//Utility screen
import RejectedLogs from "@pages/Reports/RejectedLogs";
import AutoSquareOff from "@pages/Utility/AutoSquareOff";
import CashEntryList from "@pages/Utility/CashEntryList";
import TradeLogs from "@pages/Utility/TradeLogs";
import UserLogsList from "@pages/Utility/UserLogsList";

//finance screen
import CashEntryPage from "@pages/Finance/CashEntryPage";
import CashLedgerPage from "@pages/Finance/CashLedgerPage";
import DepositeEntryPage from "@pages/Finance/DepositeEntryPage";
import DepositeLedgerPage from "@pages/Finance/DepositeLedgerPage";
import JVEntryPage from "@pages/Finance/JVEntryPage";
import JVLedgerPage from "@pages/Finance/JVLedgerPage";
import LedgerPage from "@pages/Finance/LedgerPage";

//settings screens

import BuySell from "@pages/BuySellScreen";
import EditAdmin from "@pages/CreateUser/Admin/EditAdmin";
import EditBroker from "@pages/CreateUser/Broker/EditBroker";
import EditMaster from "@pages/CreateUser/Master/EditMaster";
import EditUser from "@pages/CreateUser/User/EditUser";
import Funds from "@pages/Funds";
import BackAccount from "@pages/Funds/BankAccounts";
import Deposit from "@pages/Funds/Deposit";
import Withdrawal from "@pages/Funds/Withdrawal";
import Holidays from "@pages/Holidays";
import ImageShow from "@pages/ImageShow.tsx";
import WatchList from "@pages/MarketWatch";
import Script from "@pages/MarketWatch/Script";
import MaxQtyLimitUser from "@pages/MaxQtyLimitUser";
import PdfView from "@pages/PdfPreview";
import Position from "@pages/Portfolio";
import {
  default as ClosePosition,
  default as PositionTrade,
} from "@pages/Portfolio/ClosePosition";
import Holding from "@pages/Portfolio/Holding";
import EditQuantityScriptGroup from "@pages/QuantityScriptGroup/Edit";
import Form from "@pages/QuantityScriptGroup/Form";
import MaxQtyLimit from "@pages/QuantityScriptGroup/MaxQtyLimit";
import Reports from "@pages/Reports";
import AnnouncementsPage from "@pages/Settings/AnnouncementsPage";
import BlockScriptGroupPage from "@pages/Settings/BlockScriptGroupPage";
import BlockScriptListPage from "@pages/Settings/BlockScriptListPage";
import MCXSymbolsPage from "@pages/Settings/MCXSymbolsPage";
import QuantityScriptGroupPage from "@pages/Settings/QuantityScriptGroupPage";
import QuantityScriptListPage from "@pages/Settings/QuantityScriptListPage";
import ShortTradeReportPage from "@pages/Settings/ShortTradeReportPage";
import UserTradeTab from "@pages/TradeTab/UserTradeTab";
import Trades from "@pages/Trades";
import EditTrade from "@pages/Trades/EditTrade";
import WebView from "@pages/WebView";
import LedgerBroker from "@pages/LedgerBroker";
import AddHolidays from "@pages/Holidays/AddHolidays";

export const ScreenRoute = {
  Customers: Customers,
  FollowUps: FollowUps,
  Dashboard: Dashboard,
  Login: Login,
  Splash: Splash,
  ChangePassword: ChangePassword,
  AddAccount: AddAccount,
  Broker: Broker,
  User: Users,
  Master: Master,
  Admin: Admin,
  SummaryReport: SummaryReport,
  BlockedScript: BlockedScript,
  BrokerBill: BrokerBill,
  UplineBill: UplineBill,
  RulesAndRegulationsPage: RulesAndRegulationsPage,
  Funds: Funds,

  // BottomTab: BottomTab,
  Drawer: Drawer,

  // Utility Screens
  AutoSquareOff: AutoSquareOff,
  CashEntryList: CashEntryList,
  RejectedLogs: RejectedLogs,
  TradeLogs: TradeLogs,
  UserLogsList: UserLogsList,

  //finance screen
  LedgerPage: LedgerPage,
  JVLedgerPage: JVLedgerPage,
  JVEntryPage: JVEntryPage,
  CashLedgerPage: CashLedgerPage,
  CashEntryPage: CashEntryPage,
  DepositeLedgerPage: DepositeLedgerPage,
  DepositeEntryPage: DepositeEntryPage,

  //settings screen
  AnnouncementsPage: AnnouncementsPage,
  MCXSymbolsPage: MCXSymbolsPage,
  ShortTradeReportPage: ShortTradeReportPage,
  BlockScriptListPage: BlockScriptListPage,
  BlockScriptGroupPage: BlockScriptGroupPage,
  QuantityScriptListPage: QuantityScriptListPage,
  QuantityScriptGroupPage: QuantityScriptGroupPage,
  WatchList: WatchList,
  Script: Script,
  BuySell: BuySell,
  EditAdmin: EditAdmin,
  EditMaster: EditMaster,
  EditUser: EditUser,
  EditBroker: EditBroker,
  Trades: Trades,
  MaxQtyLimit: MaxQtyLimit,
  Form: Form,
  EditQuantityScriptGroup: EditQuantityScriptGroup,
  Deposit: Deposit,
  Withdrawal: Withdrawal,
  ImageShow: ImageShow,
  BackAccount: BackAccount,
  MaxQtyLimitUser: MaxQtyLimitUser,
  Holding: Holding,
  PositionTrade: PositionTrade,
  Position: Position,
  ClosePosition: ClosePosition,
  UserTradeTab,
  Reports,
  LedgerBroker: LedgerBroker,
  PdfView: PdfView,
  WebView: WebView,
  EditTrade,
  Holidays: Holidays,
  AddHolidays: AddHolidays,
};
