/**
 * levels.js - Advanced 10-Level Graphics & Character Equipment Visual Effects Renderer
 */

class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.levelComplete = false;
    this.score = 100;
    this.totalScore = 0;
    this.starCount = 3;

    // Visual Particle Effects Array for Sparks and Equip Shine
    this.particles = [];

    // Player Equipment State Across Levels
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
      l5: { wireX: 0, wireY: 0, phase: 0, isWireOff: false },
      l6: { hookX: 0, hookY: 0, victimBeltX: 0, victimBeltY: 0, isUnhooked: false },
      l7: { victimX: 0, victimY: 0, safeX: 0, safeY: 0, isRelocated: false },
      l8: { phoneDialed: "", isDialed: false },
      l9: { shoulderTaps: 0, chinTilted: false },
      l10: { cprCount: 0, targetCPR: 10, isCPRBeatActive: false, lastCompressionTime: 0 }
    };

    this.levelInfo = [
      {
        title: "ด่านที่ 1: ตรวจเช็กและสวมอุปกรณ์ PPE (Safety Gear)",
        desc: "สวมถุงมือยางฉนวนไฟฟ้าและรองเท้าเซฟตี้ฉนวนไฟฟ้าก่อนเข้าช่วยเหลือ",
        speech: "ด่านที่หนึ่ง หนีบเลือกถุงมือยางฉนวนและรองเท้าฉนวนไฟฟ้าเพื่อความปลอดภัย"
      },
      {
        title: "ด่านที่ 2: ปลดปลั๊กไฟ (Unplug Safely)",
        desc: "ดึงปลั๊กไฟเครื่องใช้ไฟฟ้าออกจากเต้ารับด้วยถุงมือฉนวนไฟฟ้า",
        speech: "ด่านที่สอง ดึงปลั๊กไฟออกจากเต้ารับ"
      },
      {
        title: "ด่านที่ 3: สับคัทเอาท์หลัก (Main Breaker Cut-Out)",
        desc: "โยกสวิตช์คัทเอาท์หลักลงเพื่อตัดกระแสไฟฟ้าทั้งบ้าน",
        speech: "ด่านที่สาม สับคัทเอาท์ลงด้านล่างเพื่อตัดไฟหลัก"
      },
      {
        title: "ด่านที่ 4: ปูแผ่นยางฉนวนกันไฟรั่ว (Lay Rubber Mat)",
        desc: "ลากแผ่นยางฉนวนปูบนพื้นเปียกบริเวณใกล้ตัวผู้ป่วย",
        speech: "ด่านที่สี่ ปูแผ่นยางฉนวนลงบนพื้นเปียกเพื่อป้องกันไฟฟ้าช็อต"
      },
      {
        title: "ด่านที่ 5: เขี่ยสายไฟที่มีไฟส่ายไปมา (Moving Wire Hook)",
        desc: "ใช้ไม้ตะขอฉนวนเขี่ยสายไฟที่ส่ายและเกิดประกายไฟออกจากผู้ป่วย",
        speech: "ด่านที่ห้า ใช้ไม้ฉนวนเขี่ยสายไฟที่ส่ายออกจากตัวผู้ป่วย"
      },
      {
        title: "ด่านที่ 6: ปลดผู้ป่วยออกจากโครงเหล็ก (Unhook Victim)",
        desc: "ใช้ไม้ตะขอฉนวนเกี่ยวเข็มขัดผู้ป่วยออกจากโครงเหล็กที่มีกระแสไฟรั่ว",
        speech: "ด่านที่หก เกี่ยวเข็มขัดปลดผู้ป่วยออกจากโครงเหล็กมีไฟรั่ว"
      },
      {
        title: "ด่านที่ 7: ย้ายผู้ป่วยไปยังเขตปลอดภัย (Relocate to Safe Zone)",
        desc: "ลากผู้ป่วยออกจากบริเวณ 위험 ไปยังเขตแห้งปลอดภัย",
        speech: "ด่านที่เจ็ด ลากตัวผู้ป่วยไปยังเขตแห้งปลอดภัย"
      },
      {
        title: "ด่านที่ 8: โทรสายด่วน PEA 1129 (Dial Emergency)",
        desc: "กดโทรสายด่วน 1129 บนแป้นโทรศัพท์ AR เพื่อแจ้งเหตุฉุกเฉิน",
        speech: "ด่านที่แปด กดโทรสายด่วน 1 1 2 9"
      },
      {
        title: "ด่านที่ 9: ตบไหล่เรียกและเปิดทางเดินหายใจ (Airway Check)",
        desc: "ตบไหล่ผู้ป่วย 3 ครั้งเพื่อประมวลการรู้สึกตัว และเชยคางเปิดทางเดินหายใจ",
        speech: "ด่านที่เก้า ตบไหล่ผู้ป่วยสามครั้งและเชยคางขึ้นเปิดทางเดินหายใจ"
      },
      {
        title: "ด่านที่ 10: ปั๊มหัวใจ CPR (100-120 BPM Beat)",
        desc: "ปั๊มหัวใจตามจังหวะสัญญาณไฟ 10 ครั้งเพื่อช่วยชีวิตผู้ป่วย",
        speech: "ด่านที่สิบ ปั๊มหัวใจตามจังหวะสัญญาณไฟเพื่อช่วยชีวิต"
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
      this.state.l4.matX = w * 0.18;
      this.state.l4.matY = h * 0.75;
      this.state.l4.targetX = w * 0.45;
      this.state.l4.targetY = h * 0.65;
      this.state.l4.isMatPlaced = false;
    } else if (levelNum === 5) {
      this.state.l5.wireX = w * 0.45;
      this.state.l5.wireY = h * 0.55;
      this.state.l5.phase = 0;
      this.state.l5.isWireOff = false;
    } else if (levelNum === 6) {
      this.state.l6.hookX = w * 0.2;
      this.state.l6.hookY = h * 0.4;
      this.state.l6.victimBeltX = w * 0.5;
      this.state.l6.victimBeltY = h * 0.5;
      this.state.l6.isUnhooked = false;
    } else if (levelNum === 7) {
      this.state.l7.victimX = w * 0.35;
      this.state.l7.victimY = h * 0.65;
      this.state.l7.safeX = w * 0.75;
      this.state.l7.safeY = h * 0.35;
      this.state.l7.isRelocated = false;
    } else if (levelNum === 8) {
      this.state.l8.phoneDialed = "";
      this.state.l8.isDialed = false;
    } else if (levelNum === 9) {
      this.state.l9.shoulderTaps = 0;
      this.state.l9.chinTilted = false;
    } else if (levelNum === 10) {
      this.state.l10.cprCount = 0;
      this.state.l10.lastCompressionTime = 0;
    }

    soundManager.speak(this.levelInfo[levelNum - 1].speech);
  }

  addSparkParticles(x, y, count = 8, color = "#ffd600") {
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
      // Level 1: PPE Selection
      const gloveDist = Math.hypot(cx - (w * 0.25), cy - (h * 0.5));
      const bootDist = Math.hypot(cx - (w * 0.75), cy - (h * 0.5));

      if (isPinch && gloveDist < 75 && !this.state.l1.ppeGloves) {
        this.state.l1.ppeGloves = true;
        this.playerEquipped.gloves = true;
        this.addSparkParticles(w * 0.25, h * 0.5, 15, "#00e676");
        soundManager.playGrab();
      }
      if (isPinch && bootDist < 75 && !this.state.l1.ppeBoots) {
        this.state.l1.ppeBoots = true;
        this.playerEquipped.boots = true;
        this.addSparkParticles(w * 0.75, h * 0.5, 15, "#00e676");
        soundManager.playGrab();
      }
      if (this.state.l1.ppeGloves && this.state.l1.ppeBoots) {
        this.completeLevel();
      }
    } else if (this.currentLevel === 2) {
      // Level 2: Unplug
      const dist = Math.hypot(cx - this.state.l2.plugX, cy - this.state.l2.plugY);
      if (sPluggedSpark()) this.addSparkParticles(this.state.l2.socketX, this.state.l2.socketY, 2, "#ffd600");

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
      // Level 3: Breaker
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
      // Level 4: Lay Rubber Mat
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
      // Level 5: Dynamic Swaying Wire
      if (!this.state.l5.isWireOff) {
        this.state.l5.phase += 0.06;
        this.state.l5.wireX = (w * 0.45) + Math.sin(this.state.l5.phase) * 80;
        if (Math.random() < 0.4) {
          this.addSparkParticles(this.state.l5.wireX, this.state.l5.wireY, 4, "#ff3d00");
          soundManager.playElectricSpark();
        }
      }
      const dist = Math.hypot(cx - this.state.l5.wireX, cy - this.state.l5.wireY);
      if (isPinch && dist < 90) {
        this.state.l5.wireX = cx;
        this.state.l5.wireY = cy;
        if (Math.abs(cx - (w * 0.45)) > 160) {
          this.state.l5.isWireOff = true;
          this.playerEquipped.wireOff = true;
          this.addSparkParticles(cx, cy, 25, "#00e676");
          this.completeLevel();
        }
      }
    } else if (this.currentLevel === 6) {
      // Level 6: Unhook Victim
      const dist = Math.hypot(cx - this.state.l6.victimBeltX, cy - this.state.l6.victimBeltY);
      if (Math.random() < 0.3) {
        this.addSparkParticles(this.state.l6.victimBeltX, this.state.l6.victimBeltY, 3, "#ffd600");
      }
      if (isPinch && dist < 75 && !this.state.l6.isUnhooked) {
        this.state.l6.isUnhooked = true;
        this.playerEquipped.victimUnhooked = true;
        this.addSparkParticles(cx, cy, 20, "#00e676");
        soundManager.playGrab();
        this.completeLevel();
      }
    } else if (this.currentLevel === 7) {
      // Level 7: Relocate Victim
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
      // Level 8: Phone Hotline 1129
      if (this.state.l8.phoneDialed === "1129" && !this.state.l8.isDialed) {
        this.state.l8.isDialed = true;
        this.playerEquipped.hotlineDialed = true;
        this.addSparkParticles(w * 0.5, h * 0.3, 20, "#00e676");
        this.completeLevel();
      }
    } else if (this.currentLevel === 9) {
      // Level 9: Shoulder Tap & Airway
      const shoulderX = w * 0.5;
      const shoulderY = h * 0.55;
      const chinX = w * 0.5;
      const chinY = h * 0.42;

      if (isPinch && Math.hypot(cx - shoulderX, cy - shoulderY) < 60) {
        this.state.l9.shoulderTaps = Math.min(3, this.state.l9.shoulderTaps + 1);
        this.addSparkParticles(shoulderX, shoulderY, 8, "#ffd600");
        soundManager.playClick();
      }
      if (isPinch && Math.hypot(cx - chinX, cy - chinY) < 50 && this.state.l9.shoulderTaps >= 3) {
        this.state.l9.chinTilted = true;
        this.playerEquipped.airwayOpened = true;
        this.addSparkParticles(chinX, chinY, 20, "#00e676");
        this.completeLevel();
      }
    } else if (this.currentLevel === 10) {
      // Level 10: CPR 100-120 BPM
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
    if (this.currentLevel === 8 && this.state.l8.phoneDialed.length < 4) {
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
    // Render Room Environment
    ctx.fillStyle = "#1b0730";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#2a0e45";
    ctx.fillRect(0, height * 0.68, width, height * 0.32);

    // Draw Rescuer PEA Character HUD Avatar on Left Side
    this.renderPEARescuerAvatar(ctx, 80, height * 0.72);

    // Render corresponding level object graphics
    if (this.currentLevel === 1) this.renderL1(ctx, width, height);
    else if (this.currentLevel === 2) this.renderL2(ctx, width, height);
    else if (this.currentLevel === 3) this.renderL3(ctx, width, height);
    else if (this.currentLevel === 4) this.renderL4(ctx, width, height);
    else if (this.currentLevel === 5) this.renderL5(ctx, width, height);
    else if (this.currentLevel === 6) this.renderL6(ctx, width, height);
    else if (this.currentLevel === 7) this.renderL7(ctx, width, height);
    else if (this.currentLevel === 8) this.renderL8(ctx, width, height);
    else if (this.currentLevel === 9) this.renderL9(ctx, width, height);
    else if (this.currentLevel === 10) this.renderL10(ctx, width, height);

    // Draw active particle effects
    this.drawParticles(ctx);

    // Draw Hand Cursor
    this.renderCursor(ctx, handTracker);
  }

  // Draw PEA Rescuer Character showing equipped gloves/boots in real-time
  renderPEARescuerAvatar(ctx, x, y) {
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 10;

    // Body/Uniform (PEA Purple)
    ctx.fillStyle = "#6a1b9a";
    ctx.fillRect(x - 22, y - 25, 44, 55);

    // Head
    ctx.fillStyle = "#ffcc80";
    ctx.beginPath();
    ctx.arc(x, y - 45, 20, 0, Math.PI * 2);
    ctx.fill();

    // PEA Safety Helmet (Yellow)
    ctx.fillStyle = "#ffd600";
    ctx.beginPath();
    ctx.arc(x, y - 52, 22, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 24, y - 52, 48, 6);

    // Insulated Rubber Gloves (Green if equipped)
    ctx.fillStyle = this.playerEquipped.gloves ? "#00e676" : "#e0e0e0";
    ctx.fillRect(x - 36, y - 10, 12, 24);
    ctx.fillRect(x + 24, y - 10, 12, 24);

    // Insulated Safety Boots (Green if equipped)
    ctx.fillStyle = this.playerEquipped.boots ? "#00e676" : "#424242";
    ctx.fillRect(x - 18, y + 30, 16, 20);
    ctx.fillRect(x + 2, y + 30, 16, 20);

    // Avatar Label
    ctx.fillStyle = "#ffd600";
    ctx.font = "bold 12px Kanit";
    ctx.textAlign = "center";
    ctx.fillText("เจ้าหน้าที่ PEA", x, y + 62);
    ctx.shadowBlur = 0;
  }

  renderL1(ctx, w, h) {
    // Insulated Gloves Icon Card
    ctx.fillStyle = this.state.l1.ppeGloves ? "#00e676" : "#ffd600";
    ctx.fillRect(w * 0.25 - 60, h * 0.5 - 60, 120, 120);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.strokeRect(w * 0.25 - 60, h * 0.5 - 60, 120, 120);
    ctx.fillStyle = "#111";
    ctx.font = "bold 16px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(this.state.l1.ppeGloves ? "✓ ถุงมือฉนวน" : "ถุงมือยางฉนวน", w * 0.25, h * 0.5);

    // Insulated Boots Icon Card
    ctx.fillStyle = this.state.l1.ppeBoots ? "#00e676" : "#ffd600";
    ctx.fillRect(w * 0.75 - 60, h * 0.5 - 60, 120, 120);
    ctx.strokeRect(w * 0.75 - 60, h * 0.5 - 60, 120, 120);
    ctx.fillStyle = "#111";
    ctx.fillText(this.state.l1.ppeBoots ? "✓ รองเท้าฉนวน" : "รองเท้าฉนวนไฟฟ้า", w * 0.75, h * 0.5);
  }

  renderL2(ctx, w, h) {
    const s = this.state.l2;
    // Wall Socket Box
    ctx.fillStyle = "#eceff1";
    ctx.fillRect(s.socketX - 45, s.socketY - 45, 90, 90);
    ctx.strokeStyle = "#ffd600";
    ctx.strokeRect(s.socketX - 45, s.socketY - 45, 90, 90);

    // Socket holes
    ctx.fillStyle = "#263238";
    ctx.fillRect(s.socketX - 18, s.socketY - 18, 10, 24);
    ctx.fillRect(s.socketX + 8, s.socketY - 18, 10, 24);

    // Plug
    ctx.fillStyle = s.isPlugged ? "#ff5252" : "#00e676";
    ctx.fillRect(s.plugX - 30, s.plugY - 30, 60, 60);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(s.isPlugged ? "ปลั๊กไฟ" : "ปลดไฟแล้ว", s.plugX, s.plugY + 5);
  }

  renderL3(ctx, w, h) {
    const s = this.state.l3;
    ctx.fillStyle = "#37474f";
    ctx.fillRect(s.breakerX - 70, h * 0.24, 140, h * 0.46);
    ctx.strokeStyle = "#ffd600";
    ctx.lineWidth = 4;
    ctx.strokeRect(s.breakerX - 70, h * 0.24, 140, h * 0.46);

    ctx.fillStyle = s.isPowerOn ? "#ff3d00" : "#00e676";
    ctx.fillRect(s.breakerX - 40, s.handleY - 24, 80, 48);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(s.isPowerOn ? "ON (มีกระแสไฟ)" : "OFF (ตัดไฟแล้ว)", s.breakerX, s.handleY + 6);
  }

  renderL4(ctx, w, h) {
    const s = this.state.l4;
    // Wet area puddle
    ctx.fillStyle = "rgba(0, 180, 216, 0.35)";
    ctx.beginPath();
    ctx.ellipse(s.targetX, s.targetY, 130, 65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mat
    ctx.fillStyle = s.isMatPlaced ? "#00e676" : "#ffd600";
    ctx.fillRect(s.matX - 70, s.matY - 35, 140, 70);
    ctx.fillStyle = "#111";
    ctx.font = "bold 14px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(s.isMatPlaced ? "✓ ปูแผ่นยางแล้ว" : "แผ่นยางฉนวน", s.matX, s.matY + 5);
  }

  renderL5(ctx, w, h) {
    const s = this.state.l5;
    this.renderVictim(ctx, w * 0.45, h * 0.65, !s.isWireOff);

    // Live Wire
    ctx.strokeStyle = s.isWireOff ? "#78909c" : "#ff3d00";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(s.wireX, s.wireY);
    ctx.stroke();

    // Insulated Fiberglass Pole Graphic attached to cursor
    ctx.strokeStyle = "#ffb74d";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(s.wireX, s.wireY);
    ctx.lineTo(s.wireX - 120, s.wireY + 140);
    ctx.stroke();
  }

  renderL6(ctx, w, h) {
    ctx.fillStyle = "#78909c";
    ctx.fillRect(w * 0.42, h * 0.28, 120, 160);
    ctx.fillStyle = "#ffd600";
    ctx.beginPath();
    ctx.arc(this.state.l6.victimBeltX, this.state.l6.victimBeltY, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#111";
    ctx.font = "bold 12px Kanit";
    ctx.textAlign = "center";
    ctx.fillText("จุดเกี่ยวเข็มขัด", this.state.l6.victimBeltX, this.state.l6.victimBeltY + 4);
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

    this.renderVictim(ctx, s.victimX, s.victimY, false);
  }

  renderL8(ctx, w, h) {
    const s = this.state.l8;
    ctx.fillStyle = "rgba(20, 10, 35, 0.92)";
    ctx.fillRect(w * 0.35, h * 0.22, w * 0.3, h * 0.65);
    ctx.strokeStyle = "#ffd600";
    ctx.strokeRect(w * 0.35, h * 0.22, w * 0.3, h * 0.65);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 26px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(s.phoneDialed || "กด 1129", w * 0.5, h * 0.29);

    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "Call"];
    keys.forEach((k, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      const kx = w * 0.4 + col * (w * 0.08);
      const ky = h * 0.37 + row * (h * 0.11);
      ctx.fillStyle = "#6a1b9a";
      ctx.beginPath();
      ctx.arc(kx, ky, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Kanit";
      ctx.fillText(k, kx, ky + 5);
    });
  }

  renderL9(ctx, w, h) {
    this.renderVictim(ctx, w * 0.5, h * 0.55, false);

    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(`ตบไหล่เรียกผู้ป่วย: ${this.state.l9.shoulderTaps} / 3`, w * 0.5, h * 0.32);
    ctx.fillText(this.state.l9.chinTilted ? "✓ เชยคางเปิดทางเดินหายใจแล้ว" : "แตะคางเพื่อเชยเปิดทางเดินหายใจ", w * 0.5, h * 0.37);
  }

  renderL10(ctx, w, h) {
    const s = this.state.l10;
    this.renderVictim(ctx, w * 0.5, h * 0.6, false);

    const beatRadius = s.isCPRBeatActive ? 50 : 32;
    ctx.fillStyle = "rgba(255, 61, 0, 0.45)";
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.58, beatRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Kanit";
    ctx.textAlign = "center";
    ctx.fillText(`ปั๊มหัวใจ (CPR): ${s.cprCount} / ${s.targetCPR}`, w * 0.5, h * 0.35);
  }

  renderVictim(ctx, x, y, isSparksActive) {
    // Head
    ctx.fillStyle = "#ffb74d";
    ctx.beginPath();
    ctx.arc(x, y - 40, 24, 0, Math.PI * 2);
    ctx.fill();

    // Body Shirt
    ctx.fillStyle = "#42a5f5";
    ctx.fillRect(x - 22, y - 16, 44, 52);

    if (isSparksActive) {
      ctx.strokeStyle = "#ffd600";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 35, y - 35); ctx.lineTo(x + 35, y + 35);
      ctx.moveTo(x + 35, y - 35); ctx.lineTo(x - 35, y + 35);
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

function sPluggedSpark() {
  return Math.random() < 0.25;
}

const levelManager = new LevelManager();
