import config from '@config/index';
import { LoggedUser } from '@db/schemas/loggedUser.model';
import { GlobalDataSegments, GlobalSegmentsSlug } from '@interfaces/common';
import { RealtimeResult } from '@interfaces/index';
import { ITrade } from '@interfaces/trade.interface';
import { socketGetAnnouncement } from '@reducers/announcementReducer';
import {
  getBankNiftyPrice,
  getNiftyPrice,
  setMarketData,
  setMarketDataOnlySymbols,
} from '@reducers/marketReducer';
import { socketActions } from '@reducers/socketReducer';
import { Middleware } from 'redux';
import { io, Socket } from 'socket.io-client';
import { liveTradeUpdateForDashboard } from './reducers/dashboard.reducer';

const socketClientMiddleware: Middleware = store => {
  let socket: Socket | undefined;
  return next => action => {
    try {
      const isConnectionEstablished = store.getState().socket.isConnected;
      if (socketActions.startConnecting.match(action)) {
        if (
          isConnectionEstablished == false &&
          store.getState().socket.isEstablishingConnection == false
        ) {
          const currentUser = LoggedUser.getActiveUser(globalThis.realm);

          if (socket == undefined && currentUser) {
            socket = io(config.socketUrl, {
              withCredentials: false,
              rejectUnauthorized: false,
              autoConnect: false,
              // transports: ['websocket'],
              extraHeaders: {
                cookie: currentUser.Cookie,
              },
            });
          }
          if (socket) {
            socket.on('connect', () => {
              console.log('@@@@@@@@@@@@@@@@');
              console.log('Socket connected : ', socket?.id);
              console.log('@@@@@@@@@@@@@@@@');
            });
            socket.on('connect_error', err => {
              console.log(`connect_error due to ${err.message}`);
            });

            socket.on('disconnect', () => {
              console.log('@@@@@@@@@@@@@@@@');
              console.log('Socket Disconnected : ', socket?.id);
              console.log('@@@@@@@@@@@@@@@@');
            });
            socket.on('connect_error', () => {
              console.log('@@@@@@@@@@@@@@@@');
              console.log('Socket Disconnected : ', socket?.id);
              console.log('@@@@@@@@@@@@@@@@');
            });
            socket.on('pong', () => {
              console.log('@@@@@@@@@@@@@@@@');
              console.log('pong', socket?.id);
              console.log('@@@@@@@@@@@@@@@@');
            });
            socket.connect();
            socket.emit('ping');
          }
        }
        if (socket) {
          if (!socket.hasListeners('realtime-updates')) {
            socket.on(`realtime-updates`, async (arg: RealtimeResult) => {
              if (arg) {
                if (arg.Exchange === GlobalDataSegments.mcx) {
                  arg.SegmentSlug = GlobalSegmentsSlug.mcx;
                } else {
                  if (arg.InstrumentIdentifier.startsWith('FUT')) {
                    arg.SegmentSlug = GlobalSegmentsSlug.nfoFut;
                  } else {
                    arg.SegmentSlug = GlobalSegmentsSlug.nseOpt;
                  }
                }
                store.dispatch(setMarketData(arg));
              }
            });
          }
          if (!socket?.hasListeners('execute-trade')) {
            socket?.on(`execute-trade`, (arg: ITrade) => {
              store.dispatch(liveTradeUpdateForDashboard(arg));
            });
          }
          if (!socket.hasListeners('symbol-nifty')) {
            socket.on(`symbol-nifty`, (arg: any) => {
              store.dispatch(
                getNiftyPrice({
                  LastTradePrice: arg.LastTradePrice,
                  PriceChange: arg.PriceChange,
                  LastTradePriceChange: arg.LastTradePriceChange,
                  PriceChangePercentage: arg.PriceChangePercentage,
                }),
              );
            });
          }
          if (!socket.hasListeners('symbol-banknifty')) {
            socket.on(`symbol-banknifty`, (arg: any) => {
              store.dispatch(
                getBankNiftyPrice({
                  LastTradePrice: arg.LastTradePrice,
                  PriceChange: arg.PriceChange,
                  LastTradePriceChange: arg.LastTradePriceChange,
                  PriceChangePercentage: arg.PriceChangePercentage,
                }),
              );
            });
          }
          if (!socket.hasListeners('get-announcement')) {
            socket.on(`get-announcement`, (arg: any) => {
              store.dispatch(socketGetAnnouncement(arg));
            });
          }
        }
      } else if (socket && socketActions.disconnect.match(action)) {
        socket.disconnect();
        socket.removeAllListeners();
        socket = undefined;
      } else if (socket && socketActions.subscribe.match(action)) {
        socket.emit('subscribe-symbol', action.payload);
      } else if (socket && socketActions.unsubscribe.match(action)) {
        socket.emit('unsubscribe-symbol', action.payload);
      } else if (socket && socketActions.getLastQuote.match(action)) {
        socket
          .emitWithAck('getSubscribe-symbols', action.payload)
          .then((arg: RealtimeResult) => {
            if (arg) {
              if (arg.Exchange === GlobalDataSegments.mcx) {
                arg.SegmentSlug = GlobalSegmentsSlug.mcx;
              } else {
                if (arg.InstrumentIdentifier.startsWith('FUT')) {
                  arg.SegmentSlug = GlobalSegmentsSlug.nfoFut;
                } else {
                  arg.SegmentSlug = GlobalSegmentsSlug.nseOpt;
                }
              }
              store.dispatch(setMarketDataOnlySymbols(arg));
            }
          });
      } else if (socket && socketActions.getSymbols.match(action)) {
        socket
          .emitWithAck('getSubscribe-symbols', action.payload)
          .then(async (arg: RealtimeResult) => {
            if (arg && arg.InstrumentIdentifier === 'NIFTY 50') {
              store.dispatch(
                getNiftyPrice({
                  LastTradePrice: arg.LastTradePrice,
                  PriceChange: arg.PriceChange,
                  LastTradePriceChange: arg.LastTradePriceChange,
                  PriceChangePercentage: arg.PriceChangePercentage,
                }),
              );
            }
            if (arg && arg.InstrumentIdentifier === 'NIFTY BANK') {
              store.dispatch(
                getBankNiftyPrice({
                  LastTradePrice: arg.LastTradePrice,
                  PriceChange: arg.PriceChange,
                  LastTradePriceChange: arg.LastTradePriceChange,
                  PriceChangePercentage: arg.PriceChangePercentage,
                }),
              );
            }
          });
      }
      next(action);
    } catch (error) {
      console.log('-------socketClientMiddleware Error', error);
    }
  };
};

export default socketClientMiddleware;
