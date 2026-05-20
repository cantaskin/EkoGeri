package com.recycling.config;

import com.recycling.model.*;
import com.recycling.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ContainerRepository containerRepository;
    private final RewardRepository rewardRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Kullanıcılar
        userRepository.save(User.builder()
                .fullName("Sistem Yöneticisi")
                .email("admin@recycling.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.SUPER_ADMIN).points(0).totalWasteKg(0.0).build());

        userRepository.save(User.builder()
                .fullName("Belediye Yöneticisi")
                .email("belediye@recycling.com")
                .passwordHash(passwordEncoder.encode("belediye123"))
                .role(Role.MUNICIPALITY_ADMIN).points(0).totalWasteKg(0.0).build());

        userRepository.save(User.builder()
                .fullName("Ahmet Yılmaz")
                .email("ahmet@recycling.com")
                .passwordHash(passwordEncoder.encode("user123"))
                .role(Role.CITIZEN).points(450).totalWasteKg(38.5).build());

        userRepository.save(User.builder()
                .fullName("Fatma Kaya")
                .email("fatma@recycling.com")
                .passwordHash(passwordEncoder.encode("user123"))
                .role(Role.CITIZEN).points(320).totalWasteKg(27.0).build());

        userRepository.save(User.builder()
                .fullName("Mehmet Demir")
                .email("mehmet@recycling.com")
                .passwordHash(passwordEncoder.encode("user123"))
                .role(Role.CITIZEN).points(210).totalWasteKg(18.2).build());

        // Containerlar (İstanbul koordinatları)
        containerRepository.save(Container.builder().name("Kadıköy Merkez - Plastik").address("Kadıköy Meydanı, İstanbul").latitude(40.9903).longitude(29.0236).capacityKg(100.0).currentFillKg(65.0).wasteType(WasteType.PLASTIC).status(ContainerStatus.ACTIVE).build());
        containerRepository.save(Container.builder().name("Kadıköy Merkez - Kağıt").address("Kadıköy Meydanı, İstanbul").latitude(40.9900).longitude(29.0240).capacityKg(100.0).currentFillKg(90.0).wasteType(WasteType.PAPER).status(ContainerStatus.FULL).build());
        containerRepository.save(Container.builder().name("Moda Parkı - Cam").address("Moda Caddesi, Kadıköy").latitude(40.9820).longitude(29.0290).capacityKg(80.0).currentFillKg(20.0).wasteType(WasteType.GLASS).status(ContainerStatus.ACTIVE).build());
        containerRepository.save(Container.builder().name("Beşiktaş İskele - Plastik").address("Beşiktaş İskelesi, İstanbul").latitude(41.0425).longitude(29.0033).capacityKg(120.0).currentFillKg(45.0).wasteType(WasteType.PLASTIC).status(ContainerStatus.ACTIVE).build());
        containerRepository.save(Container.builder().name("Beşiktaş Çarşı - Karışık").address("Beşiktaş Çarşı, İstanbul").latitude(41.0415).longitude(29.0055).capacityKg(150.0).currentFillKg(130.0).wasteType(WasteType.MIXED).status(ContainerStatus.FULL).build());
        containerRepository.save(Container.builder().name("Üsküdar Sahil - Cam").address("Üsküdar Sahil Yolu, İstanbul").latitude(41.0235).longitude(29.0150).capacityKg(80.0).currentFillKg(10.0).wasteType(WasteType.GLASS).status(ContainerStatus.ACTIVE).build());
        containerRepository.save(Container.builder().name("Şişli Merkez - Kağıt").address("Şişli Meydanı, İstanbul").latitude(41.0600).longitude(28.9870).capacityKg(100.0).currentFillKg(55.0).wasteType(WasteType.PAPER).status(ContainerStatus.ACTIVE).build());
        containerRepository.save(Container.builder().name("Bakırköy - Organik").address("Bakırköy Orman Parkı, İstanbul").latitude(40.9800).longitude(28.8720).capacityKg(60.0).currentFillKg(30.0).wasteType(WasteType.ORGANIC).status(ContainerStatus.ACTIVE).build());
        containerRepository.save(Container.builder().name("Pendik - Plastik").address("Pendik Sahil, İstanbul").latitude(40.8762).longitude(29.2333).capacityKg(100.0).currentFillKg(5.0).wasteType(WasteType.PLASTIC).status(ContainerStatus.ACTIVE).build());
        containerRepository.save(Container.builder().name("Maltepe Sahil - Karışık").address("Maltepe Sahil, İstanbul").latitude(40.9342).longitude(29.1314).capacityKg(120.0).currentFillKg(85.0).wasteType(WasteType.MIXED).status(ContainerStatus.ACTIVE).build());

        // Ödüller
        rewardRepository.save(Reward.builder().name("İstanbul Kart 10 TL").description("Toplu taşıma kartına 10 TL yükleme").pointsCost(100).category(RewardCategory.TRANSPORT).stock(-1).isActive(true).build());
        rewardRepository.save(Reward.builder().name("İstanbul Kart 25 TL").description("Toplu taşıma kartına 25 TL yükleme").pointsCost(250).category(RewardCategory.TRANSPORT).stock(-1).isActive(true).build());
        rewardRepository.save(Reward.builder().name("Market İndirimi %10").description("Anlaşmalı marketlerde %10 indirim kuponu").pointsCost(150).category(RewardCategory.DISCOUNT).stock(50).isActive(true).build());
        rewardRepository.save(Reward.builder().name("1 GB İnternet").description("Operatörünüze 1 GB ek internet paketi").pointsCost(200).category(RewardCategory.INTERNET).stock(-1).isActive(true).build());
        rewardRepository.save(Reward.builder().name("Kitapçı Hediye Çeki 20 TL").description("Anlaşmalı kitapçılarda 20 TL değerinde hediye çeki").pointsCost(180).category(RewardCategory.DISCOUNT).stock(30).isActive(true).build());
        rewardRepository.save(Reward.builder().name("Sinema Bileti").description("Anlaşmalı sinemaya 1 bilet").pointsCost(350).category(RewardCategory.OTHER).stock(20).isActive(true).build());
    }
}
