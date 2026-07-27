/**
 * levels.js - Pure HD Canvas Room Art + Cutout Transparent Dino Victim ('victim_transparent.png')
 */

class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.levelComplete = false;
    this.score = 100;
    this.totalScore = 0;
    this.starCount = 3;

    this.particles = [];

    // Transparent Dino Victim Character PNG ('victim_transparent.png')
    this.victimImage = new Image();
    this.victimImage.src = 'victim_transparent.png';

    // Player Equipment State
    this.playerEquipped = {
      gloves: false,
      boots: false,
      matPlaced: false,
      wireOff: false,
      victimUnhooked: false,
      victimMoved: false,
      hotlineDialed: false,
      airwayOpened: false,
      cprDone: false
    };

    // 10 Levels State Definitions
    this.state = {
      l1: { ppeGloves: false, ppeBoots: false },
      l2: { plugX: 0, plugY: 0, socketX: 0, socketY: 0, isPlugged: true },
      l3: { breakerX: 0, breakerY: 0, handleY: 0, isPowerOn: true },
      l4: { matX: 0, matY: 0, targetX: 0, targetY: 0, isMatPlaced: false },
      l5: { wireX: 0, wireY: 0, isWireOff: false, pushProgress: 0, targetPushes: 3, isPinching: false },
      l6: { hookX: 0, hookY: 0, victimBeltX: 0, victimBeltY: 0, pullCount: 0, targetPulls: 3, isUnhooked: false, isPinching: false },
      l7: { victimX: 0, victimY: 0, safeX: 0, safeY: 0, isRelocated: false },
      l8: { phoneDialed: "", isDialed: false, wasPinching: false },
      l9: { shoulderTaps: 0, chinTilted: false },
      l10: { cprCount: 0, targetCPR: 10, isCPRBeatActive: false, lastCompressionTime: 0 }
    };

    this.levelInfo = [
      {
        title: "ด่านที่ 1: ตรวจเช็กและสวมอุปกรณ์ PPE สีส้มกันไฟให้น้อง Watt-D",
        desc: "สวมถุงมือยางฉนวนไฟฟ้าสีส้มและรองเท้าเซฟตี้ฉนวนไฟฟ้าให้น้อง Watt-D",
        speech: "ด่านที่หนึ่ง เลือกถุงมือและรองเท้าฉนวนไฟฟ้าสีส้มให้น้องวัตต์ดีครับ"
      },
      {
        title: "ด่านที่ 2: ปลดปลั๊กไฟเครื่องใช้ไฟฟ้า (Unplug Safely)",
        desc: "ดึงปลั๊กไฟสายอ่อนหนาออกจากเต้ารับผนังอย่างปลอดภัย",
        speech: "ด่านที่สอง ดึงปลั๊กไฟออกจากเต้ารับ"
      },
      {
        title: "ด่านที่ 3: สับคัทเอาท์หลัก (Main Breaker Cut-Out)",
        desc: "โยกสวิตช์คัทเอาท์สะพานไฟหลักลงเพื่อตัดกระแสไฟฟ้าทั้งบ้าน",
        speech: "ด่านที่สาม สับคัทเอาท์ลงด้านล่างเพื่อตัดไฟหลัก"
      },
      {
        title: "ด่านที่ 4: ปูแผ่นยางฉนวนกันไฟรั่วบนพื้นที่เปียกน้ำ",
        desc: "ลากแผ่นยางฉนวนปูบนพื้นที่เปียกน้ำเจิ่งนองบริเวณใกล้ตัวไดโนเสาร์น้อย",
        speech: "ด่านที่สี่ ปูแผ่นยางฉนวนลงบนพื้นที่มีน้ำขังเจิ่งนอง"
      },
      {
        title: "ด่านที่ 5: ใช้ไม้ฉนวนแห้งแตะผลักสายไฟออก",
        desc: "ใช้ไม้ตะขอฉนวนไฟเบอร์กลาสแห้ง แตะผลักสายไฟออกจากตัวน้องไดโนเสาร์ตามจำนวนครั้งที่กำหนด",
        speech: "ด่านที่ห้า ใช้ไม้แห้งฉนวนแตะผลักสายไฟออกจากตัวผู้ป่วย"
      },
      {
        title: "ด่านที่ 6: ปลดน้องไดโนเสาร์ออกจากโครงเก้าอี้เหล็กที่มีไฟรั่ว",
        desc: "ใช้ไม้ตะขอฉนวนเกี่ยวเข็มขัดดึงปลดน้องไดโนเสาร์ออกจากโครงเก้าอี้เหล็กตามจำนวนครั้งที่กำหนด",
        speech: "ด่านที่หก เกี่ยวเข็มขัดปลดผู้ป่วยออกจากโครงเก้าอี้เหล็กมีไฟรั่ว"
      },
      {
        title: "ด่านที่ 7: ย้ายน้องไดโนเสาร์ไปยังเขตแห้งปลอดภัย",
        desc: "ลากน้องไดโนเสาร์ออกจากบริเวณน้ำขังไปยังเขตแห้งปลอดภัย",
        speech: "ด่านที่เจ็ด ลากตัวผู้ป่วยไปยังเขตแห้งปลอดภัย"
      },
      {
        title: "ด่านที่ 8: โทรสายด่วน PEA 1129 บนสมาร์ทโฟน iPhone",
        desc: "กด 1129 บนหน้าจอสมาร์ทโฟน iPhone เพื่อแจ้งสายด่วนฉุกเฉิน PEA",
        speech: "ด่านที่แปด กดโทรสายด่วน 1 1 2 9 บนสมาร์ทโฟน"
      },
      {
        title: "ด่านที่ 9: ตบไหล่และเชยคางเปิดทางเดินหายใจ",
        desc: "ใช้มือเสมือนตบไหล่น้องไดโนเสาร์ 3 ครั้ง และแตะเชยคางเปิดทางเดินหายใจ",
        speech: "ด่านที่เก้า ใช้มือตบไหล่ผู้ป่วยสามครั้งและเชยคางเปิดทางเดินหายใจ"
      },
      {
        title: "ด่านที่ 10: ปั๊มหัวใจ CPR น้องไดโนเสาร์ (100-120 BPM)",
        desc: "ใช้มือเสมือนประสานกันปั๊มหัวใจน้องไดโนเสาร์ตามจังหวะสัญญาณไฟ 10 ครั้ง",
        speech: "ด่านที่สิบ ประสานมือปั๊มหัวใจตามจังหวะสัญญาณไฟ"
      }
    ];
  }

  initLevel(levelNum, canvasWidth, canvasHeight) {
    this.currentLevel = levelNum;
    this.levelComplete = false;
    this.score = 100;
    this.particles = [];

    const w = canvasWidth;
    const h = canvasHeight;

    if (levelNum === 1) {
      this.state.l1.ppeGloves = false;
      this.state.l1.ppeBoots = false;
    } else if (levelNum === 2) {
      this.state.l2.socketX = w * 0.7;
      this.state.l2.socketY = h * 0.45;
      this.state.l2.plugX = w * 0.7;
      this.state.l2.plugY = h * 0.45;
      this.state.l2.isPlugged = true;
    } else if (levelNum === 3) {
      this.state.l3.breakerX = w * 0.5;
      this.state.l3.breakerY = h * 0.3;
      this.state.l3.handleY = h * 0.35;
      this.state.l3.isPowerOn = true;
    } else if (levelNum === 4) {
      // สุ่มตำแหน่งวางแผ่นยางด่าน 4 (ไม่ให้ทับกับเป้าหมายตรงกลาง)
      const randomSides = [
        { x: w * 0.15, y: h * 0.75 },
        { x: w * 0.15, y: h * 0.42 },
        { x: w * 0.82, y: h * 0.75 },
        { x: w * 0.82, y: h * 0.42 }
      ];
      const selectedStart = randomSides[Math.floor(Math.random() * randomSides.length)];
      this.state.l4.matX = selectedStart.x;
      this.state.l4.matY = selectedStart.y;
      this.state.l4.targetX = w * 0.5;
      this.state.l4.targetY = h * 0.65;
      this.state.l4.isMatPlaced = false;
    } else if (levelNum === 5) {
      this.state.l5.wireX = w * 0.45;
      this.state.l5.wireY = h * 0.55;
      this.state.l5.pushProgress = 0;
      this.state.l5.targetPushes = Math.floor(Math.random() * 3) + 3; // สุ่ม 3 ถึง 5 ครั้ง
      this.state.l5.isWireOff = false;
      this.state.l5.isPinching = false;
    } else if (levelNum === 6) {
      this.state.l6.hookX = w * 0.2;
      this.state.l6.hookY = h * 0.4;
      this.state.l6.victimBeltX = w * 0.5;
      this.state.l6.victimBeltY = h * 0.5;
      this.state.l6.pullCount = 0;
      this.state.l6.targetPulls = Math.floor(Math.random() * 3) + 3; // สุ่ม 3 ถึง 5 ครั้ง
      this.state.l6.isUnhooked = false;
      this.state.l6.isPinching = false;
    } else if (levelNum === 7) {
      // สุ่มจุดเกิดน้องไดโนเสาร์และเขตแห้งปลอดภัย ห้ามทับกัน (ห่างกันอย่างน้อย 260px)
      let vx, vy, sx, sy, dist;
      const minX = w * 0.25, maxX = w * 0.75;
      const minY = h * 0.35, maxY = h * 0.75;
      do {
        vx = minX + Math.random() * (maxX - minX);
        vy = minY + Math.random() * (maxY - minY);
        sx = minX + Math.random() * (maxX - minX);
        sy = minY + Math.random() * (maxY - minY);
        dist = Math.hypot(vx - sx, vy - sy);
      } while (dist < 260);

      this.state.l7.victimX = vx;
      this.state.l7.victimY = vy;
      this.state.l7.safeX = sx;
      this.state.l7.safeY = sy;
      this.state.l7.isRelocated = false;
    } else if (levelNum === 8) {
      this.state.l8.phoneDialed = "";
      this.state.l8.isDialed = false;
      this.state.l8.wasPinching = false;
    } else if (levelNum === 9) {
      this.state.l9.shoulderTaps = 0;
      this.state.l9.chinTilted = false;
    } else if (levelNum === 10) {
      this.state.l10.cprCount = 0;
      this.state.l10.lastCompressionTime = 0;
    }

    soundManager.speak(this.levelInfo[levelNum - 1].speech);
  }

  addSparkParticles(x, y, count = 8, color = "#ff9800") {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1.0,
        color: color
      });
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawParticles(ctx) {
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(2, p.life * 6), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }

  update(handTracker, canvasWidth, canvasHeight) {
    if (this.levelComplete) return;

    this.updateParticles();

    const cx = handTracker.cursorX;
    const cy = handTracker.cursorY;
    const isPinch = handTracker.isPinching;
    const w = canvasWidth;
    const h = canvasHeight;

    if (this.currentLevel === 1) {
      const gloveDist = Math.hypot(cx - (w * 0.25), cy - (h * 0.5));
      const bootDist = Math.hypot(cx - (w * 0.75), cy - (h * 0.5));

      if (isPinch && gloveDist < 85 && !this.state.l1.ppeGloves) {
        this.state.l1.ppeGloves = true;
        this.playerEquipped.gloves = true;
        this.addSparkParticles(w * 0.25, h * 0.5, 15, "#ff9800");
        soundManager.playGrab();
      }
      if (isPinch && bootDist < 85 && !this.state.l1.ppeBoots) {
        this.state.l1.ppeBoots = true;
        this.playerEquipped.boots = true;
        this.addSparkParticles(w * 0.75, h * 0.5, 15, "#ff9800");
        soundManager.playGrab();
      }
      if (this.state.l1.ppeGloves && this.state.l1.ppeBoots) {
        this.completeLevel();
      }
    } else if (this.currentLevel === 2) {
      const dist = Math.hypot(cx - this.state.l2.plugX, cy - this.state.l2.plugY);
      if (Math.random() < 0.25) this.addSparkParticles(this.state.l2.socketX, this.state.l2.socketY, 2, "#ffd600");

      if (isPinch && dist < 65) {
        this.state.l2.plugX = cx;
        this.state.l2.plugY = cy;
        const pullDist = Math.hypot(this.state.l2.plugX - this.state.l2.socketX, this.state.l2.plugY - this.state.l2.socketY);
        if (pullDist > 120 && this.state.l2.isPlugged) {
          this.state.l2.isPlugged = false;
          this.addSparkParticles(this.state.l2.plugX, this.state.l2.plugY, 20, "#ff5252");
          soundManager.playUnplug();
          this.completeLevel();
        }
      } else if (this.state.l2.isPlugged) {
        this.state.l2.plugX += (this.state.l2.socketX - this.state.l2.plugX) * 0.2;
        this.state.l2.plugY += (this.state.l2.socketY - this.state.l2.plugY) * 0.2;
      }
    } else if (this.currentLevel === 3) {
      const bx = this.state.l3.breakerX;
      const hy = this.state.l3.handleY;
      const dist = Math.hypot(cx - bx, cy - hy);
      if (this.state.l3.isPowerOn && Math.random() < 0.3) {
        this.addSparkParticles(bx, hy, 2, "#ffd600");
      }
      if (isPinch && dist < 70) {
        this.state.l3.handleY = Math.max(h * 0.35, Math.min(h * 0.6, cy));
        if (this.state.l3.handleY >= h * 0.58 && this.state.l3.isPowerOn) {
          this.state.l3.isPowerOn = false;
          this.addSparkParticles(bx, this.state.l3.handleY, 25, "#00e676");
          soundManager.playBreaker();
          this.completeLevel();
        }
      }
    } else if (this.currentLevel === 4) {
      const dist = Math.hypot(cx - this.state.l4.matX, cy - this.state.l4.matY);
      if (isPinch && dist < 85) {
        this.state.l4.matX = cx;
        this.state.l4.matY = cy;
        const targetDist = Math.hypot(this.state.l4.matX - this.state.l4.targetX, this.state.l4.matY - this.state.l4.targetY);
        if (targetDist < 60 && !this.state.l4.isMatPlaced) {
          this.state.l4.isMatPlaced = true;
          this.playerEquipped.matPlaced = true;
          this.addSparkParticles(this.state.l4.matX, this.state.l4.matY, 20, "#00e676");
          soundManager.playGrab();
          this.completeLevel();
        }
      }
    } else if (this.currentLevel === 5) {
      const dist = Math.hypot(cx - this.state.l5.wireX, cy - this.state.l5.wireY);
      if (!this.state.l5.isWireOff && Math.random() < 0.3) {
        this.addSparkParticles(this.state.l5.wireX, this.state.l5.wireY, 3, "#ff3d00");
      }

      if (isPinch) {
        if (!this.state.l5.isPinching && dist < 85 && !this.state.l5.isWireOff) {
          this.state.l5.isPinching = true;
          this.state.l5.pushProgress++;
          this.addSparkParticles(this.state.l5.wireX, this.state.l5.wireY, 12, "#ffd600");
          this.state.l5.wireX -= 35;
          soundManager.playClick();
          if (this.state.l5.pushProgress >= this.state.l5.targetPushes) {
            this.state.l5.isWireOff = true;
            this.playerEquipped.wireOff = true;
            this.addSparkParticles(this.state.l5.wireX, this.state.l5.wireY, 25, "#00e676");
            this.completeLevel();
          }
        }
      } else {
        this.state.l5.isPinching = false;
      }
    } else if (this.currentLevel === 6) {
      const dist = Math.hypot(cx - this.state.l6.victimBeltX, cy - this.state.l6.victimBeltY);
      if (!this.state.l6.isUnhooked && Math.random() < 0.3) {
        this.addSparkParticles(this.state.l6.victimBeltX, this.state.l6.victimBeltY, 3, "#ffd600");
      }

      if (isPinch) {
        if (!this.state.l6.isPinching && dist < 80 && !this.state.l6.isUnhooked) {
          this.state.l6.isPinching = true;
          this.state.l6.pullCount++;
          this.addSparkParticles(cx, cy, 12, "#ffd600");
          soundManager.playClick();
          if (this.state.l6.pullCount >= this.state.l6.targetPulls) {
            this.state.l6.isUnhooked = true;
            this.playerEquipped.victimUnhooked = true;
            this.addSparkParticles(cx, cy, 25, "#00e676");
            soundManager.playGrab();
            this.completeLevel();
          }
        }
      } else {
        this.state.l6.isPinching = false;
      }
    } else if (this.currentLevel === 7) {
      const dist = Math.hypot(cx - this.state.l7.victimX, cy - this.state.l7.victimY);
      if (isPinch && dist < 90) {
        this.state.l7.victimX = cx;
        this.state.l7.victimY = cy;
        const safeDist = Math.hypot(this.state.l7.victimX - this.state.l7.safeX, this.state.l7.victimY - this.state.l7.safeY);
        if (safeDist < 100 && !this.state.l7.isRelocated) {
          this.state.l7.isRelocated = true;
          this.playerEquipped.victimMoved = true;
          this.addSparkParticles(cx, cy, 20, "#00e676");
          this.completeLevel();
        }
      }
    } else if (this.currentLevel === 8) {
      const phoneW = Math.min(w * 0.75, Math.max(260, Math.min(w * 0.38, 320)));
      const phoneH = Math.min(h * 0.65, 520);
      const phoneX = (w - phoneW) / 2;
      const phoneY = Math.max(h * 0.22, 130);

      const screenX = phoneX + 8;
      const screenY = phoneY + 32;
      const screenW = phoneW - 16;
      const screenH = phoneH - 42;

      const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "Call"];
      const startY = screenY + 115;
      const rowGap = (screenH - 130) / 4;
      const colGap = screenW / 3;
      const btnRadius = Math.min(24, Math.min(colGap, rowGap) * 0.38);

      if (isPinch) {
        if (!this.state.l8.wasPinching) {
          this.state.l8.wasPinching = true;
          keys.forEach((k, idx) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            const kx = screenX + colGap * (col + 0.5);
            const ky = startY + rowGap * (row + 0.4);

            if (Math.hypot(cx - kx, cy - ky) < btnRadius + 12) {
              this.pressKeypad(k);
            }
          });
        }
      } else {
        this.state.l8.wasPinching = false;
      }

      if (this.state.l8.phoneDialed === "1129" && !this.state.l8.isDialed) {
        this.state.l8.isDialed = true;
        this.playerEquipped.hotlineDialed = true;
        this.addSparkParticles(w * 0.5, h * 0.3, 20, "#00e676");
        this.completeLevel();
      }
    } else if (this.currentLevel === 9) {
      const shoulderX = w * 0.5;
      const shoulderY = h * 0.55;
      const chinX = w * 0.5;
      const chinY = h * 0.42;

      if (isPinch && Math.hypot(cx - shoulderX, cy - shoulderY) < 60) {
        this.state.l9.shoulderTaps = Math.min(3, this.state.l9.shoulderTaps + 1);
        this.addSparkParticles(shoulderX, shoulderY, 8, "#ff9800");
        soundManager.playClick();
      }
      if (isPinch && Math.hypot(cx - chinX, cy - chinY) < 50 && this.state.l9.shoulderTaps >= 3) {
        this.state.l9.chinTilted = true;
        this.playerEquipped.airwayOpened = true;
        this.addSparkParticles(chinX, chinY, 20, "#00e676");
        this.completeLevel();
      }
    } else if (this.currentLevel === 10) {
      const now = Date.now();
      if (now - this.state.l10.lastCompressionTime > 500) {
        this.state.l10.isCPRBeatActive = Math.floor(now / 500) % 2 === 0;
        if (this.state.l10.isCPRBeatActive) soundManager.playCPRBeat();
      }

      const chestX = w * 0.5;
      const chestY = h * 0.6;
      const dist = Math.hypot(cx - chestX, cy - chestY);

      if (isPinch && dist < 70) {
        if (now - this.state.l10.lastCompressionTime > 400) {
          this.state.l10.cprCount++;
          this.state.l10.lastCompressionTime = now;
          this.addSparkParticles(chestX, chestY, 12, "#ff3d00");
          soundManager.playClick();
          if (this.state.l10.cprCount >= this.state.l10.targetCPR) {
            this.playerEquipped.cprDone = true;
            this.completeLevel();
          }
        }
      }
    }
  }

  pressKeypad(num) {
    if (this.currentLevel !== 8) return;
    if (num === "C") {
      this.state.l8.phoneDialed = "";
      soundManager.playClick();
    } else if (num === "Call") {
      soundManager.playClick();
    } else if (this.state.l8.phoneDialed.length < 4 && !isNaN(num)) {
      this.state.l8.phoneDialed += num;
      soundManager.playClick();
    }
  }

  completeLevel() {
    this.levelComplete = true;
    this.totalScore += this.score;
    this.starCount = this.score >= 90 ? 3 : (this.score >= 70 ? 2 : 1);
    soundManager.playVictory();
  }

  render(ctx, width, height, handTracker) {
    // 1. Ultra Crisp Canvas Vector Background (Warm Cozy Living Room)
    this.renderUltraHDRoom(ctx, width, height);

    // 2. Draw Nong Watt-D Avatar
    this.renderNongWattDAvatar(ctx, 90, height * 0.72);

    // 3. Render Level Graphics Objects
    if (this.currentLevel === 1) this.renderL1(ctx, width, height);
    else if (this.currentLevel === 2) this.renderL2(ctx, width, height);
    else if (this.currentLevel === 3) this.renderL3(ctx, width, height);
    else if (this.currentLevel === 4) this.renderL4(ctx, width, height);
    else if (this.currentLevel === 5) this.renderL5(ctx, width, height);
    else if (this.currentLevel === 6) this.renderL6(ctx, width, height);
    else if (this.currentLevel === 7) this.renderL7(ctx, width, height);
    else if (this.currentLevel === 8) this.renderL8(ctx, width, height);
    else if (this.currentLevel === 9) this.renderL9(ctx, width, height, handTracker);
    else if (this.currentLevel === 10) this.renderL10(ctx, width, height, handTracker);

    // 4. Draw active particle effects
    this.drawParticles(ctx);

    // 5. Draw AR Cursor
    this.renderCursor(ctx, handTracker);
  }

  // Ultra HD Crisp Canvas Vector Background (Cozy Home Living Room)
  renderUltraHDRoom(ctx, w, h) {
    // Wall Background Gradient (Warm Cream / Peach)
    const wallGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    wallGrad.addColorStop(0, "#fff5e6");
    wallGrad.addColorStop(1, "#ffe8cc");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h * 0.65);

    // Floor (Warm Wood Flooring)
    const floorGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
    floorGrad.addColorStop(0, "#d7ccc8");
    floorGrad.addColorStop(1, "#a1887f");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, h * 0.65, w, h * 0.35);

    // Wood Floor Planks
    ctx.strokeStyle = "rgba(121, 85, 72, 0.3)";
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.65); ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Skirting Board
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(0, h * 0.65 - 6, w, 8);

    // Wall Clock on top left
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(100, 75, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8d6e63";
    ctx.lineWidth = 4;
    ctx.stroke();
    // Clock hands
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 75); ctx.lineTo(100, 55);
    ctx.moveTo(100, 75); ctx.lineTo(115, 75);
    ctx.stroke();

    // Large Sunlight Window on top right
    ctx.fillStyle = "#e0f7fa";
    ctx.fillRect(w * 0.72, h * 0.08, 160, 110);
    ctx.strokeStyle = "#ffb74d";
    ctx.lineWidth = 8;
    ctx.strokeRect(w * 0.72, h * 0.08, 160, 110);
    // Window Panes
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.72 + 80, h * 0.08); ctx.lineTo(w * 0.72 + 80, h * 0.08 + 110);
    ctx.moveTo(w * 0.72, h * 0.08 + 55); ctx.lineTo(w * 0.72 + 160, h * 0.08 + 55);
    ctx.stroke();

    // Cute Plant Pot in Corner
    ctx.fillStyle = "#81c784";
    ctx.beginPath();
    ctx.ellipse(w * 0.72 - 30, h * 0.65 - 40, 25, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#a1887f";
    ctx.fillRect(w * 0.72 - 45, h * 0.65 - 25, 30, 25);
  }

  // Nong Watt-D Avatar (Scaled up for maximum cuteness & visibility)
  renderNongWattDAvatar(ctx, x, y) {
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 14;

    const scale = 1.35; // ขยายขนาดน้อง Watt-D เพิ่มขึ้นอย่างน่ารัก

    ctx.fillStyle = "#741b8a";
    ctx.beginPath();
    ctx.arc(x, y, 32 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(x, y - 4 * scale, 22 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(x - 9 * scale, y - 6 * scale, 4.5 * scale, 0, Math.PI * 2);
    ctx.arc(x + 9 * scale, y - 6 * scale, 4.5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Eye Highlights
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x - 10 * scale, y - 8 * scale, 1.8 * scale, 0, Math.PI * 2);
    ctx.arc(x + 8 * scale, y - 8 * scale, 1.8 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Blushing Cheeks
    ctx.fillStyle = "rgba(255, 128, 171, 0.6)";
    ctx.beginPath();
    ctx.arc(x - 16 * scale, y + 2 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.arc(x + 16 * scale, y + 2 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#811877";
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.arc(x, y, 8 * scale, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${Math.round(12 * scale)}px Kanit`;
    ctx.textAlign = "center";
    ctx.fillText("PEA", x, y + 22 * scale);

    // Lightning ears
    ctx.fillStyle = "#ffd600";
    ctx.beginPath();
    ctx.moveTo(x - 22 * scale, y - 26 * scale); ctx.lineTo(x - 36 * scale, y - 48 * scale); ctx.lineTo(x - 24 * scale, y - 46 * scale);
    ctx.lineTo(x - 32 * scale, y - 58 * scale); ctx.lineTo(x - 14 * scale, y - 34 * scale); ctx.lineTo(x - 20 * scale, y - 35 * scale);
    ctx.closePath(); ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 22 * scale, y - 26 * scale); ctx.lineTo(x + 36 * scale, y - 48 * scale); ctx.lineTo(x + 24 * scale, y - 46 * scale);
    ctx.lineTo(x + 32 * scale, y - 58 * scale); ctx.lineTo(x + 14 * scale, y - 34 * scale); ctx.lineTo(x + 20 * scale, y - 35 * scale);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = this.playerEquipped.gloves ? "#00e676" : "#ff9800";
    ctx.beginPath();
    ctx.arc(x - 36 * scale, y + 10 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.arc(x + 36 * scale, y + 10 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.playerEquipped.boots ? "#00e676" : "#ff9800";
    ctx.fillRect(x - 20 * scale, y + 28 * scale, 15 * scale, 18 * scale);
    ctx.fillRect(x + 5 * scale, y + 28 * scale, 15 * scale, 18 * scale);

    ctx.fillStyle = "#ffd600";
    ctx.font = `bold ${Math.round(14 * scale)}px Kanit`;
    ctx.fillText("น้อง Watt-D (PEA)", x, y + 60 * scale);
    ctx.shadowBlur = 0;
  }

  renderL1(ctx, w, h) {
    ctx.fillStyle = this.state.l1.ppeGloves ? "#00e676" : "#ff9800";
    ctx.fillRect(w * 0.25 - 65, h * 0.5 - 65, 130, 130);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(w * 0.25 - 65, h * 0.5 - 65, 130, 130);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(this.state.l1.ppeGloves ? "✓ สวมถุงมือแล้ว" : "ถุงมือยางส้มฉนวน", w * 0.25, h * 0.5);

    ctx.fillStyle = this.state.l1.ppeBoots ? "#00e676" : "#ff9800";
    ctx.fillRect(w * 0.75 - 65, h * 0.5 - 65, 130, 130);
    ctx.strokeRect(w * 0.75 - 65, h * 0.5 - 65, 130, 130);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.state.l1.ppeBoots ? "✓ สวมรองเท้าแล้ว" : "รองเท้าฉนวนส้ม", w * 0.75, h * 0.5);
  }

  renderL2(ctx, w, h) {
    const s = this.state.l2;
    ctx.fillStyle = "#eceff1";
    ctx.fillRect(s.socketX - 50, s.socketY - 50, 100, 100);
    ctx.strokeStyle = "#ffd600";
    ctx.strokeRect(s.socketX - 50, s.socketY - 50, 100, 100);

    ctx.fillStyle = "#263238";
    ctx.fillRect(s.socketX - 20, s.socketY - 20, 12, 26);
    ctx.fillRect(s.socketX + 8, s.socketY - 20, 12, 26);

    ctx.strokeStyle = "#212121";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(s.plugX, s.plugY);
    ctx.lineTo(s.plugX - 160, s.plugY + 220);
    ctx.stroke();

    ctx.fillStyle = s.isPlugged ? "#ff5252" : "#00e676";
    ctx.fillRect(s.plugX - 35, s.plugY - 35, 70, 70);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 15px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(s.isPlugged ? "ปลั๊กเครื่องใช้ไฟ" : "ถอดไฟแล้ว", s.plugX, s.plugY + 5);
  }

  renderL3(ctx, w, h) {
    const s = this.state.l3;
    ctx.fillStyle = "#37474f";
    ctx.fillRect(s.breakerX - 75, h * 0.22, 150, h * 0.48);
    ctx.strokeStyle = "#ffd600";
    ctx.lineWidth = 4;
    ctx.strokeRect(s.breakerX - 75, h * 0.22, 150, h * 0.48);

    ctx.fillStyle = s.isPowerOn ? "#ff3d00" : "#00e676";
    ctx.fillRect(s.breakerX - 45, s.handleY - 26, 90, 52);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(s.isPowerOn ? "ON (สับขึ้นไฟเข้า)" : "OFF (ตัดไฟหลักแล้ว)", s.breakerX, s.handleY + 6);
  }

  renderL4(ctx, w, h) {
    const s = this.state.l4;
    ctx.fillStyle = "rgba(3, 169, 244, 0.45)";
    ctx.beginPath();
    ctx.ellipse(s.targetX, s.targetY, 150, 75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0288d1";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.ellipse(s.targetX, s.targetY, 100, 45, 0, 0, Math.PI * 2);
    ctx.ellipse(s.targetX, s.targetY, 50, 22, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = s.isMatPlaced ? "#00e676" : "#ffd600";
    ctx.fillRect(s.matX - 75, s.matY - 38, 150, 76);
    ctx.fillStyle = "#111";
    ctx.font = "bold 15px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(s.isMatPlaced ? "✓ ปูแผ่นยางสำเร็จ" : "แผ่นยางฉนวนปูพื้น", s.matX, s.matY + 6);
  }

  renderL5(ctx, w, h) {
    const s = this.state.l5;
    this.renderDinoVictimImage(ctx, w * 0.45, h * 0.65, !s.isWireOff);

    ctx.strokeStyle = s.isWireOff ? "#78909c" : "#ff3d00";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(s.wireX, s.wireY);
    ctx.stroke();

    ctx.strokeStyle = "#ff9800";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(s.wireX, s.wireY);
    ctx.lineTo(s.wireX - 140, s.wireY + 160);
    ctx.stroke();

    if (!s.isWireOff) {
      ctx.strokeStyle = "#ffd600";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(s.wireX, s.wireY, 35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#333333";
      ctx.font = "bold 14px Kanit";
      ctx.textAlign = "center";
      ctx.fillText(`ใช้ไม้แห้งแตะดันไฟ (${s.pushProgress}/3)`, s.wireX, s.wireY - 45);
    }
  }

  renderL6(ctx, w, h) {
    const s = this.state.l6;
    const chairX = w * 0.5;
    const chairY = h * 0.52;

    // 1. Draw Metallic Chair Frame (โครงเก้าอี้เหล็กที่มีไฟรั่ว)
    ctx.strokeStyle = s.isUnhooked ? "#78909c" : "#cfd8dc";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";

    // Chair Backrest Frame
    ctx.strokeRect(chairX - 60, chairY - 110, 120, 90);
    // Chair Seat
    ctx.strokeRect(chairX - 70, chairY - 20, 140, 20);
    // Chair Legs
    ctx.beginPath();
    ctx.moveTo(chairX - 55, chairY); ctx.lineTo(chairX - 65, chairY + 110);
    ctx.moveTo(chairX + 55, chairY); ctx.lineTo(chairX + 65, chairY + 110);
    ctx.moveTo(chairX - 35, chairY); ctx.lineTo(chairX - 40, chairY + 100);
    ctx.moveTo(chairX + 35, chairY); ctx.lineTo(chairX + 40, chairY + 100);
    ctx.stroke();

    // Metallic Cushion Fill
    ctx.fillStyle = s.isUnhooked ? "#90a4ae" : "#b0bec5";
    ctx.fillRect(chairX - 54, chairY - 104, 108, 78);
    ctx.fillRect(chairX - 64, chairY - 14, 128, 10);

    // High-Voltage Hazard Label on Chair
    ctx.fillStyle = "#ff3d00";
    ctx.font = "bold 14px Kanit";
    ctx.textAlign = "center";
    ctx.fillText("⚡ โครงเก้าอี้เหล็กไฟรั่ว ⚡", chairX, chairY - 122);

    // Electric Sparks Effect around chair if not unhooked
    if (!s.isUnhooked && Math.random() < 0.6) {
      this.addSparkParticles(chairX + (Math.random() - 0.5) * 120, chairY + (Math.random() - 0.5) * 150, 3, "#ffd600");
    }

    // 2. Draw Nong Dino Victim attached to metal chair frame
    this.renderDinoVictimImage(ctx, chairX, chairY - 20, !s.isUnhooked);

    // 3. Belt/Harness Connection Point on Victim
    if (!s.isUnhooked) {
      ctx.fillStyle = "#ff9800";
      ctx.beginPath();
      ctx.arc(s.victimBeltX, s.victimBeltY, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffd600";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Kanit";
      ctx.textAlign = "center";
      ctx.fillText("เกี่ยวเข็มขัด", s.victimBeltX, s.victimBeltY + 4);
    }

    // 4. Wooden Stick with Safety Hook (ไม้ฉนวนพร้อมขอเกี่ยวปลดผู้ป่วย)
    const cursorX = s.isUnhooked ? chairX - 90 : s.victimBeltX - 10;
    const cursorY = s.isUnhooked ? chairY - 40 : s.victimBeltY + 10;

    // Wooden Stick Handle
    ctx.strokeStyle = "#8d6e63";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(cursorX - 180, cursorY + 140);
    ctx.lineTo(cursorX, cursorY);
    ctx.stroke();

    // Wooden Stick Grain Details
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cursorX - 170, cursorY + 130);
    ctx.lineTo(cursorX - 10, cursorY - 5);
    ctx.stroke();

    // Insulation Safety Hook (ขอเกี่ยวฉนวน)
    ctx.strokeStyle = "#ffd600";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cursorX + 15, cursorY - 10, 20, 0.4 * Math.PI, 1.6 * Math.PI, false);
    ctx.stroke();

    // Label for Wooden Hook Tool
    ctx.fillStyle = "#ffd600";
    ctx.font = "bold 15px Kanit";
    ctx.textAlign = "center";
    ctx.fillText("ไม้ฉนวนพร้อมขอเกี่ยว", cursorX - 80, cursorY + 90);
  }

  renderL7(ctx, w, h) {
    const s = this.state.l7;
    ctx.fillStyle = "rgba(0, 230, 118, 0.35)";
    ctx.beginPath();
    ctx.arc(s.safeX, s.safeY, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00e676";
    ctx.font = "bold 16px Kanit";
    ctx.textAlign = "center";
    ctx.fillText("เขตแห้งปลอดภัย", s.safeX, s.safeY);

    this.renderDinoVictimImage(ctx, s.victimX, s.victimY, false);
  }

  renderL8(ctx, w, h) {
    const s = this.state.l8;
    const isMobile = w < 768;
    
    // Scale and position phone to fit below header and stay clear of top banner
    const phoneW = Math.min(w * 0.75, Math.max(260, Math.min(w * 0.38, 320)));
    const phoneH = Math.min(h * 0.65, 520);
    const phoneX = (w - phoneW) / 2;
    const phoneY = Math.max(h * 0.22, 130);

    // Phone Body
    ctx.fillStyle = "#1c1c1e";
    ctx.beginPath();
    ctx.roundRect(phoneX, phoneY, phoneW, phoneH, 32);
    ctx.fill();
    ctx.strokeStyle = "#a1a1a6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Notch
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(w * 0.5 - 35, phoneY + 10, 70, 16, 8);
    ctx.fill();

    // Screen area
    const screenX = phoneX + 8;
    const screenY = phoneY + 32;
    const screenW = phoneW - 16;
    const screenH = phoneH - 42;
    ctx.fillStyle = "#0f0c1b";
    ctx.beginPath();
    ctx.roundRect(screenX, screenY, screenW, screenH, 20);
    ctx.fill();

    // Screen Title & Displayed Number
    ctx.fillStyle = "#ffd600";
    ctx.font = "bold 16px Kanit";
    ctx.textAlign = "center";
    ctx.fillText("กดเบอร์โทร 1129", w * 0.5, screenY + 28);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Kanit";
    ctx.fillText(s.phoneDialed || "_ _ _ _", w * 0.5, screenY + 70);

    // Keypad layout setup
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "Call"];
    const startY = screenY + 115;
    const rowGap = (screenH - 130) / 4;
    const colGap = screenW / 3;
    const btnRadius = Math.min(24, Math.min(colGap, rowGap) * 0.38);

    keys.forEach((k, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const kx = screenX + colGap * (col + 0.5);
      const ky = startY + rowGap * (row + 0.4);

      ctx.fillStyle = k === "Call" ? "#34c759" : (k === "C" ? "#ff3d00" : "#3a3a3c");
      ctx.beginPath();
      ctx.arc(kx, ky, btnRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${btnRadius * 0.85}px Kanit`;
      ctx.fillText(k, kx, ky + btnRadius * 0.32);
    });
  }

  renderL9(ctx, w, h, handTracker) {
    this.renderDinoVictimImage(ctx, w * 0.5, h * 0.58, false, 175); // เพิ่มขนาดน้องไดโนเสาร์เป็น 175px

    this.renderVirtualHandOverlay(ctx, w * 0.5, h * 0.58, "ตบไหล่");
    if (this.state.l9.shoulderTaps >= 3) {
      this.renderVirtualHandOverlay(ctx, w * 0.5, h * 0.44, "เชยคาง");
    }

    ctx.fillStyle = "#333333";
    ctx.font = "bold 18px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(`ตบไหล่เรียกผู้ป่วย: ${this.state.l9.shoulderTaps} / 3`, w * 0.5, h * 0.28);
    ctx.fillText(this.state.l9.chinTilted ? "✓ เชยคางเปิดทางเดินหายใจแล้ว" : "แตะคางเพื่อเชยเปิดทางเดินหายใจ", w * 0.5, h * 0.33);
  }

  renderL10(ctx, w, h, handTracker) {
    const s = this.state.l10;
    this.renderDinoVictimImage(ctx, w * 0.5, h * 0.62, false, 175); // เพิ่มขนาดน้องไดโนเสาร์เป็น 175px

    const beatRadius = s.isCPRBeatActive ? 56 : 38;
    ctx.fillStyle = "rgba(255, 61, 0, 0.45)";
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.60, beatRadius, 0, Math.PI * 2);
    ctx.fill();

    this.renderCPRInterlockedHands(ctx, w * 0.5, h * 0.60);

    ctx.fillStyle = "#333333";
    ctx.font = "bold 22px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(`ปั๊มหัวใจ (CPR): ${s.cprCount} / ${s.targetCPR}`, w * 0.5, h * 0.28);
  }

  renderVirtualHandOverlay(ctx, x, y, label) {
    ctx.fillStyle = "rgba(255, 183, 77, 0.85)";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#111";
    ctx.font = "bold 12px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 4);
  }

  renderCPRInterlockedHands(ctx, x, y) {
    ctx.fillStyle = "rgba(255, 183, 77, 0.9)";
    ctx.beginPath();
    ctx.ellipse(x, y, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.font = "bold 11px Kanit";
    ctx.textAlign = "center";
    ctx.fillText("กด CPR", x, y + 4);
  }

  // Render Cutout Transparent Dino Victim Character ('victim_transparent.png')
  renderDinoVictimImage(ctx, x, y, isSparksActive, customSize = 130) {
    const size = customSize;
    if (this.victimImage.complete && this.victimImage.naturalWidth !== 0) {
      ctx.drawImage(this.victimImage, x - size / 2, y - size / 2 - 10, size, size);
    } else {
      ctx.fillStyle = "#4caf50";
      ctx.beginPath();
      ctx.arc(x, y - 20, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isSparksActive) {
      ctx.strokeStyle = "#ffd600";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(x - size * 0.38, y - size * 0.38); ctx.lineTo(x + size * 0.38, y + size * 0.38);
      ctx.moveTo(x + size * 0.38, y - size * 0.38); ctx.lineTo(x - size * 0.38, y + size * 0.38);
      ctx.stroke();
    }
  }

  renderCursor(ctx, handTracker) {
    const x = handTracker.cursorX;
    const y = handTracker.cursorY;
    const isPinch = handTracker.isPinching;

    ctx.fillStyle = isPinch ? "#00e676" : "#ffd600";
    ctx.beginPath();
    ctx.arc(x, y, isPinch ? 18 : 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

const levelManager = new LevelManager();
