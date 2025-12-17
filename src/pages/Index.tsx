import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const ucPackages = [
  { id: 1, uc: 60, price: 75, bonus: 0, popular: false },
  { id: 2, uc: 325, price: 375, bonus: 25, popular: true },
  { id: 3, uc: 660, price: 750, bonus: 60, popular: false },
  { id: 4, uc: 1800, price: 1875, bonus: 300, popular: false },
  { id: 5, uc: 3850, price: 3750, bonus: 850, popular: false },
];

const paymentMethods = [
  { id: 1, name: 'Банковская карта', icon: 'CreditCard', desc: 'Visa, MasterCard, МИР' },
  { id: 2, name: 'СБП', icon: 'Smartphone', desc: 'Система быстрых платежей' },
  { id: 3, name: 'Электронные кошельки', icon: 'Wallet', desc: 'ЮMoney, QIWI' },
  { id: 4, name: 'Криптовалюта', icon: 'Bitcoin', desc: 'BTC, ETH, USDT' },
];

const faqItems = [
  { q: 'Как быстро приходит UC?', a: 'UC зачисляется мгновенно после оплаты, обычно это занимает 1-5 минут.' },
  { q: 'Безопасна ли покупка?', a: 'Да, мы используем официальные методы пополнения. Ваш аккаунт в безопасности.' },
  { q: 'Нужен ли пароль от аккаунта?', a: 'Нет! Для пополнения достаточно только вашего Player ID.' },
  { q: 'Что делать если UC не пришел?', a: 'Свяжитесь с поддержкой через Telegram или WhatsApp - мы решим проблему в течение 15 минут.' },
  { q: 'Есть ли гарантия?', a: 'Да, мы даем 100% гарантию на все покупки. Если возникнет проблема - вернем деньги.' },
];

const ORDERS_API = 'https://functions.poehali.dev/73b4d0b5-c9f6-4419-bde1-cc175403f3c8';
const PAYMENT_API = 'https://functions.poehali.dev/60f4a9e0-1dc7-4456-8a9e-f1169c728c9c';
const SETTINGS_API = 'https://functions.poehali.dev/1cf54fcb-967f-4475-94e2-2fd4c4a7cfd4';

const Index = () => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [playerIdError, setPlayerIdError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contacts, setContacts] = useState({ telegram_contact: '@your_telegram', whatsapp_contact: '+79001234567' });
  const { toast } = useToast();

  useEffect(() => {
    fetch(SETTINGS_API)
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(() => {});
  }, []);

  const selectedPkg = ucPackages.find(pkg => pkg.id === selectedPackage);

  const handleBuyClick = (pkgId: number) => {
    setSelectedPackage(pkgId);
    setOrderDialogOpen(true);
    setPlayerId('');
    setPlayerIdError('');
  };

  const validatePlayerId = (id: string) => {
    if (!id.trim()) {
      setPlayerIdError('Введите Player ID');
      return false;
    }
    if (!/^\d+$/.test(id)) {
      setPlayerIdError('Player ID должен содержать только цифры');
      return false;
    }
    if (id.length < 8 || id.length > 12) {
      setPlayerIdError('Player ID должен быть от 8 до 12 цифр');
      return false;
    }
    setPlayerIdError('');
    return true;
  };

  const handleConfirmOrder = async () => {
    if (!validatePlayerId(playerId)) return;
    if (!selectedPkg) return;

    setIsSubmitting(true);

    try {
      const orderResponse = await fetch(ORDERS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: playerId,
          uc_amount: selectedPkg.uc,
          bonus_uc: selectedPkg.bonus,
          price: selectedPkg.price,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Ошибка при создании заказа');
      }

      const orderData = await orderResponse.json();

      const paymentResponse = await fetch(PAYMENT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderData.id,
          amount: selectedPkg.price,
          description: `Пополнение ${selectedPkg.uc} UC для Player ID: ${playerId}`,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Ошибка при создании платежа');
      }

      const paymentData = await paymentResponse.json();

      if (paymentData.payment_url) {
        window.location.href = paymentData.payment_url;
      } else {
        toast({
          title: '🎮 Заказ создан!',
          description: `Заказ #${orderData.id} создан. Свяжитесь с поддержкой для оплаты.`,
        });
        setOrderDialogOpen(false);
        setPlayerId('');
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось оформить заказ. Попробуйте позже или свяжитесь с поддержкой.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Coins" size={48} className="text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              UC Store
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Быстрое и безопасное пополнение UC для PUBG Mobile</p>
        </header>

        <Tabs defaultValue="catalog" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card">
            <TabsTrigger value="catalog" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="CreditCard" size={20} className="mr-2" />
              Оплата
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Поддержка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ucPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 ${
                    selectedPackage === pkg.id ? 'ring-2 ring-primary' : ''
                  } ${pkg.popular ? 'border-primary border-2' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground font-bold">
                      🔥 ПОПУЛЯРНО
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon name="Coins" size={40} className="text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">{pkg.uc} UC</CardTitle>
                    {pkg.bonus > 0 && (
                      <CardDescription className="text-secondary font-semibold">
                        +{pkg.bonus} UC бонус!
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-4xl font-bold text-primary">{pkg.price} ₽</div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-lg py-6" 
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyClick(pkg.id);
                      }}
                    >
                      <Icon name="ShoppingCart" size={20} className="mr-2" />
                      Купить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Gift" size={24} className="text-primary" />
                  Преимущества покупки
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Icon name="Zap" size={24} className="text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Моментально</h4>
                    <p className="text-sm text-muted-foreground">UC приходит за 1-5 минут</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Shield" size={24} className="text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Безопасно</h4>
                    <p className="text-sm text-muted-foreground">100% официальный метод</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="HeadphonesIcon" size={24} className="text-secondary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Поддержка 24/7</h4>
                    <p className="text-sm text-muted-foreground">Всегда на связи</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Wallet" size={24} className="text-primary" />
                  Способы оплаты
                </CardTitle>
                <CardDescription>Выберите удобный способ оплаты</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="hover:border-primary transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <Icon name={method.icon as any} size={24} className="text-primary" />
                        {method.name}
                      </CardTitle>
                      <CardDescription>{method.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="List" size={24} className="text-primary" />
                  Как оплатить
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Выберите пакет UC</h4>
                    <p className="text-sm text-muted-foreground">
                      Перейдите во вкладку "Каталог" и выберите нужное количество UC
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Введите Player ID</h4>
                    <p className="text-sm text-muted-foreground">
                      Укажите ваш игровой ID из PUBG Mobile (находится в настройках профиля)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Оплатите заказ</h4>
                    <p className="text-sm text-muted-foreground">
                      Выберите удобный способ оплаты и завершите покупку
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Получите UC</h4>
                    <p className="text-sm text-muted-foreground">
                      UC автоматически зачислятся на ваш аккаунт в течение 1-5 минут
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MessageCircleQuestion" size={24} className="text-primary" />
                  Часто задаваемые вопросы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left hover:text-primary">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="HeadphonesIcon" size={24} className="text-primary" />
                  Служба поддержки
                </CardTitle>
                <CardDescription>Мы всегда на связи и готовы помочь!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-lg py-6" size="lg">
                  <Icon name="Send" size={20} className="mr-2" />
                  Написать в Telegram
                </Button>
                <Button className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-lg py-6" size="lg">
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Написать в WhatsApp
                </Button>
                <div className="text-center pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Время ответа: обычно до 15 минут</p>
                  <p className="text-sm text-muted-foreground">Работаем 24/7 без выходных</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Icon name="ShoppingCart" size={24} className="text-primary" />
                Оформление заказа
              </DialogTitle>
              <DialogDescription>
                Введите ваш Player ID для получения UC
              </DialogDescription>
            </DialogHeader>
            
            {selectedPkg && (
              <div className="bg-primary/10 rounded-lg p-4 my-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Выбранный пакет:</span>
                  <span className="font-bold text-lg">{selectedPkg.uc} UC</span>
                </div>
                {selectedPkg.bonus > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Бонус:</span>
                    <span className="font-semibold text-secondary">+{selectedPkg.bonus} UC</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">К оплате:</span>
                  <span className="font-bold text-2xl text-primary">{selectedPkg.price} ₽</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playerId" className="flex items-center gap-2">
                  <Icon name="User" size={16} />
                  Player ID
                </Label>
                <Input
                  id="playerId"
                  type="text"
                  placeholder="Например: 5123456789"
                  value={playerId}
                  onChange={(e) => {
                    setPlayerId(e.target.value);
                    if (playerIdError) validatePlayerId(e.target.value);
                  }}
                  className={playerIdError ? 'border-destructive' : ''}
                />
                {playerIdError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {playerIdError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  💡 Найдите ваш Player ID в игре: Профиль → Основное
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setOrderDialogOpen(false)}
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button
                onClick={handleConfirmOrder}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Оформляем...
                  </>
                ) : (
                  <>
                    <Icon name="CheckCircle" size={18} className="mr-2" />
                    Оформить заказ
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <footer className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">© 2024 UC Store. Все права защищены.</p>
          <p className="text-xs text-muted-foreground mt-2">
            Мы не являемся официальными представителями PUBG Mobile
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;