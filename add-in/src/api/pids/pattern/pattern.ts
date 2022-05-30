abstract class Pattern {
  name: string;

  getName() {
    return name;
  }

  /**
   * @return all leaf patterns
   */
  flatten() {
    // return Seq(this)
  }

  /**
   * Recursively visit the pattern elements starting from the root
   *
   * @param visitor
   */
  abstract visit(visitor);

  naming() {
    // this.visit(new NamingVisitor())
  }

  abstract numChar();
}
